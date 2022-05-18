import type { CustomTransformers, Diagnostic, LanguageService, Program } from 'typescript';
import type { languages } from 'monaco-editor';
import transformer from '../../lib/transformer/platforms/web-worker';

type Class<T> = new (...args: any[]) => T;

// @ts-expect-error
self.customTSWorkerFactory = (
  TypeScriptWorker: Class<languages.typescript.TypeScriptWorker>,
  ts: typeof import('typescript')
) => {
  return class MonacoTSWorker extends TypeScriptWorker {
    private _languageService!: LanguageService;

    private createMockDiagnosticExtras(_program: Program) {
      const diagnostics: Diagnostic[] = [];
      const addDiagnostic = (diag: Diagnostic) => diagnostics.push(diag);
      const removeDiagnostic = (index: number) => diagnostics.splice(index, 1);

      return { addDiagnostic: addDiagnostic, removeDiagnostic: removeDiagnostic, diagnostics: diagnostics };
    }

    // Any LanguageServiceHost extensions should work
    public getCustomTransformers(): CustomTransformers {
      const program = this._languageService.getProgram();

      if (!program) {
        return {};
      }

      const diagnosticExtra = this.createMockDiagnosticExtras(program);

      return {
        before: [
          transformer(
            program,
            {
              /* empty plugin option */
            },
            {
              ts,
              library: 'monaco-typescript-service',
              ...diagnosticExtra,
            }
          ),
        ],
      };
    }

    // Adds a custom function to the webworker
    async getDTSEmitForFile(fileName: string) {
      const result = await this.getEmitOutput(fileName);
      const firstDTS = result.outputFiles.find((o: languages.typescript.OutputFile) => o.name.endsWith('.d.ts'));
      return (firstDTS && firstDTS.text) || '';
    }
  };
};
