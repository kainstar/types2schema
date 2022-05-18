import * as Monaco from 'monaco-editor';

const DEFAULT_COMPILER_OPTIONS: Monaco.languages.typescript.CompilerOptions = {
  strict: true,
  target: Monaco.languages.typescript.ScriptTarget.ES5,
  module: Monaco.languages.typescript.ModuleKind.CommonJS,
  noUnusedLocals: true,
  noUnusedParameters: true,
  noImplicitAny: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
};

const DEFAULT_EXTRA_LIBS = [
  {
    filePath: 'global.d.ts',
    content: `declare function schema<T>(): any;`,
  },
];

interface ITypeScriptSandboxConstructorOptions {
  compilerOptions?: Monaco.languages.typescript.CompilerOptions;
  defaultScriptContent?: string;
  defaultFilePath?: string;
}

Monaco.languages.typescript.typescriptDefaults.setWorkerOptions({
  customWorkerPath: 'extends-ts.worker.js',
});

const DEFAULT_FILE_CONTENT = `
enum Gender {
  Male = 1,
  Female = 2,
}

interface IApi {
  name: string;
  gender?: Gender;
}

schema<IApi>();
`.trim();

const DEFAULT_FILE_PATH = 'main.ts';

interface IDiagnosticsMap {
  syntacticDiagnostics: Monaco.languages.typescript.Diagnostic[];
  semanticDiagnostics: Monaco.languages.typescript.Diagnostic[];
}

export interface ICompliedResult {
  diagnosticsMap: IDiagnosticsMap | null;
  jsCode: string;
}

/**
 * This class rely on Monaco, it must be a singleton
 */
class TypeScriptSandbox {
  private _model: Monaco.editor.ITextModel;

  constructor(
    {
      compilerOptions,
      defaultScriptContent = '',
      defaultFilePath = DEFAULT_FILE_PATH,
    }: ITypeScriptSandboxConstructorOptions,
    private logger: Console = console
  ) {
    this.setCompilerOptions({
      ...DEFAULT_COMPILER_OPTIONS,
      ...compilerOptions,
    });
    DEFAULT_EXTRA_LIBS.forEach(({ filePath, content }) => {
      this.addExtraLibs(content, filePath);
    });

    // try get model from global Monaco Editor Cache for local development fast-refresh
    const uri = Monaco.Uri.file(defaultFilePath);
    this._model = Monaco.editor.getModel(uri) ?? Monaco.editor.createModel(defaultScriptContent, 'typescript', uri);
  }

  /**
   * Alias for `Monaco.languages.typescript.typescriptDefaults.setCompilerOptions`
   */
  setCompilerOptions(compilerOptions: Monaco.languages.typescript.CompilerOptions) {
    this.logger.debug(`[Sandbox] set compiler options: `, compilerOptions);
    Monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
  }

  /**
   * Alias for `Monaco.languages.typescript.typescriptDefaults.addExtraLib`
   */
  addExtraLibs(content: string, filePath?: string): Monaco.IDisposable {
    this.logger.debug(`[Sandbox] add extra lib: `, { filePath, content });
    return Monaco.languages.typescript.typescriptDefaults.addExtraLib(content, filePath);
  }

  getCurrentTextModel() {
    return this._model;
  }

  async getWorkerProcess(model: Monaco.editor.ITextModel) {
    const workerLoader = await Monaco.languages.typescript.getTypeScriptWorker();
    return workerLoader(model.uri);
  }

  private castModelOrUri(modelOrUri: Monaco.editor.ITextModel | Monaco.Uri) {
    const model = Monaco.Uri.isUri(modelOrUri) ? Monaco.editor.getModel(modelOrUri) : modelOrUri;
    return model;
  }

  async getEmitResult(modelOrUri: Monaco.editor.ITextModel | Monaco.Uri = this._model) {
    const model = this.castModelOrUri(modelOrUri);
    if (!model) {
      return null;
    }
    const client = await this.getWorkerProcess(model);
    return client.getEmitOutput(model.uri.toString());
  }

  async getDiagnosticsMap(modelOrUri: Monaco.editor.ITextModel | Monaco.Uri = this._model) {
    const model = this.castModelOrUri(modelOrUri);
    if (!model) {
      return null;
    }
    const client = await this.getWorkerProcess(model);

    const syntacticDiagnostics = await client.getSyntacticDiagnostics(model.uri.toString());
    const semanticDiagnostics = await client.getSemanticDiagnostics(model.uri.toString());

    return { syntacticDiagnostics, semanticDiagnostics };
  }

  async getCompiledJsCode(modelOrUri: Monaco.editor.ITextModel | Monaco.Uri = this._model) {
    const result = await this.getEmitResult(modelOrUri);
    const outputJsFile = result?.outputFiles.find((o) => o.name.endsWith('.js'));
    return outputJsFile?.text ?? '';
  }

  async getCompiledDTSCode(modelOrUri: Monaco.editor.ITextModel | Monaco.Uri = this._model) {
    const result = await this.getEmitResult(modelOrUri);
    const outputDtsFile = result?.outputFiles.find((o) => o.name.endsWith('.d.ts'));
    return outputDtsFile?.text ?? '';
  }

  async getCompiledResult(modelOrUri: Monaco.editor.ITextModel | Monaco.Uri = this._model): Promise<ICompliedResult> {
    const diagnosticsMap = await this.getDiagnosticsMap(modelOrUri);
    const jsCode = await this.getCompiledJsCode(modelOrUri);

    return {
      diagnosticsMap,
      jsCode,
    };
  }
}

export const typescriptSandboxInstance = new TypeScriptSandbox({
  defaultScriptContent: DEFAULT_FILE_CONTENT,
});
