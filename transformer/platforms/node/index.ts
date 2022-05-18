import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import * as readPkgUp from 'read-pkg-up';

import { createDiagnosticsForError, TransformerError } from '../../error';
import { createGenerator, SchemaGenerator } from '../../generator';
import { IPlatformIndependentHost, TransformerExtras } from '../../types';
import { transformObjectToExpression } from '../../utils';
import { BaseEntity } from '../../generator/entity/base';
import { stringifyEntity } from '../../generator/utils/circular-json';

interface INodePlatformPluginConfig {
  debug?: boolean;
  logFile?: string;
}

interface ITransformerNodePlatformHost extends IPlatformIndependentHost<INodePlatformPluginConfig> {
  schemaCallSignatureDeclaration?: ts.CallSignatureDeclaration;
  schemaGenerator: SchemaGenerator;
}

const SCHEMA_METHOD_NAME = 'schema';

const pkgResult = readPkgUp.sync({
  cwd: __dirname,
})!;

const PackageJson = pkgResult.packageJson;

/**
 * @internal only for development
 */
const LIB_MAIN_FILE_PATH = path.resolve(pkgResult.path, '../', PackageJson.main!);

type IPath = string | ts.ResolvedModuleFull;

function isSamePathWithoutExt(fileA: IPath, fileB: IPath) {
  const parsePathOrModule = (file: IPath) => {
    if (typeof file === 'string') {
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const dir = path.dirname(file);
      return { base, dir: path.normalize(dir) };
    } else {
      const base = path.basename(file.resolvedFileName, file.extension);
      const dir = path.dirname(file.resolvedFileName);
      return { base, dir: path.normalize(dir) };
    }
  };

  const { base: baseA, dir: dirA } = parsePathOrModule(fileA);
  const { base: baseB, dir: dirB } = parsePathOrModule(fileB);

  return dirA === dirB && baseA === baseB;
}

/** 检查是否为 schema import 声明 */
export function isSchemaImportDeclaration(
  node: ts.Node,
  host: ITransformerNodePlatformHost
): node is ts.ImportDeclaration {
  if (!ts.isImportDeclaration(node)) {
    return false;
  }

  const importModuleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;

  // check lib name is equal to package name
  if (PackageJson.name === importModuleSpecifier) {
    return true;
  }

  // resolve absolute path, compare is equal to lib file
  try {
    const source = node.getSourceFile().fileName;
    const resolvedModule =
      host.program.getResolvedModuleWithFailedLookupLocationsFromCache(importModuleSpecifier, source)?.resolvedModule ??
      // in ts-node, module maybe is unresolved in cache, use source file info infer module path
      node.getSourceFile().resolvedModules?.get(importModuleSpecifier);

    if (!resolvedModule) {
      return false;
    }

    return isSamePathWithoutExt(LIB_MAIN_FILE_PATH, resolvedModule);
  } catch {
    return false;
  }
}

const isInTSNodeRuntimeEnv = () => {
  try {
    return !!process[Symbol.for('ts-node.register.instance')];
  } catch {
    // not in node env
    return false;
  }
};

/** 将 schema 函数的定义声明节点存储下来 */
export function setSchemaCallSignatureDeclaration(
  importDeclaration: ts.ImportDeclaration,
  host: ITransformerNodePlatformHost
) {
  const { typeChecker } = host;
  const namedBindings = importDeclaration.importClause?.namedBindings;
  if (!namedBindings || !ts.isNamedImports(namedBindings)) {
    return;
  }

  const schemaImportSpecifier = namedBindings.elements.find((element) => {
    const propertyName = element.propertyName?.escapedText as string;
    const name = element.name.escapedText as string;
    return propertyName === SCHEMA_METHOD_NAME || (!propertyName && name === SCHEMA_METHOD_NAME);
  });

  if (schemaImportSpecifier) {
    host.schemaCallSignatureDeclaration = typeChecker.getTypeAtLocation(schemaImportSpecifier).symbol
      .valueDeclaration! as ts.CallSignatureDeclaration;
  }
}

/** 检查是否为 schema 调用表达式 */
export function isSchemaCallExpression(node: ts.Node, host: ITransformerNodePlatformHost): node is ts.CallExpression {
  const { typeChecker } = host;
  if (!ts.isCallExpression(node)) {
    return false;
  }

  const signature = typeChecker.getResolvedSignature(node);
  // have to check declaration exist, otherwise maybe execute `undefined === undefined`
  if (!signature || !signature.declaration || !host.schemaCallSignatureDeclaration) {
    return false;
  }

  return signature.declaration === host.schemaCallSignatureDeclaration;
}

/**
 * Main Transform Logic
 */
function transformNode(node: ts.Node, host: ITransformerNodePlatformHost): ts.Node {
  const { typeChecker, schemaGenerator } = host;

  // 删除 import 声明，防止 ts noUnusedLocals 报错
  if (isSchemaImportDeclaration(node, host)) {
    setSchemaCallSignatureDeclaration(node, host);
    return ts.factory.createEmptyStatement();
  }

  if (!isSchemaCallExpression(node, host)) {
    return node;
  }

  try {
    // 没有泛型参数，直接返回一个空对象
    if (!node.typeArguments) {
      throw new TransformerError(`'schema' 方法必须传递类型参数`, node);
    }

    // 获取泛型类型参数
    const typeNode = node.typeArguments[0];
    const typeArg = typeChecker.getTypeFromTypeNode(typeNode);
    const schema = schemaGenerator.createSchema(typeArg, typeNode);
    return transformObjectToExpression(schema, ts);
  } catch (error) {
    if (error instanceof TransformerError) {
      error.fillNodeIfEmpty(node);
      const diagnostic = createDiagnosticsForError(error, ts);
      // Use both `getSemanticDiagnostics` instead of `transformerExtras.addDiagnostic` because:
      //    TS-NODE only report a part of diagnostics, and ts-patch's extra diagnostics not in these.
      if (isInTSNodeRuntimeEnv()) {
        const diagnostics = host.program.getSyntacticDiagnostics(node.getSourceFile()) as ts.DiagnosticWithLocation[];
        diagnostics.push(diagnostic);
      } else {
        host.transformerExtras.addDiagnostic(diagnostic);
      }
    } else {
      throw error;
    }
  }

  return node;
}

function visitNodeAndChildren(node: ts.SourceFile, host: ITransformerNodePlatformHost): ts.SourceFile;
function visitNodeAndChildren(node: ts.Node, host: ITransformerNodePlatformHost): ts.Node;

function visitNodeAndChildren(node: ts.Node, host: ITransformerNodePlatformHost): ts.Node {
  return ts.visitEachChild(
    transformNode(node, host),
    (childNode) => visitNodeAndChildren(childNode, host),
    host.transformationContext
  );
}

const LOG_FILE = path.join(process.cwd(), './types2schema-transformer.log');

export function createLogger(outputFile: string = LOG_FILE) {
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  function appendLogInfo(content: string) {
    fs.appendFileSync(outputFile, content);
  }

  return appendLogInfo;
}

export default function transformer(
  program: ts.Program,
  pluginConfig: INodePlatformPluginConfig,
  transformerExtras: TransformerExtras
): ts.TransformerFactory<ts.SourceFile> {
  const logger = createLogger(pluginConfig.logFile);

  class NodePlatformSchemaGenerator extends SchemaGenerator {
    onRootEntityCreated(rootEntity: BaseEntity, node: ts.Node) {
      if (pluginConfig?.debug) {
        logger?.(
          [
            `[时间]: ${new Date().toLocaleString()}\n`,
            `[解析类型节点]: ${node.getText()}\n`,
            `[Entity 内容]: ${stringifyEntity(rootEntity)}\n`,
            '\n',
          ].join('')
        );
      }
    }
  }

  return (transformationContext: ts.TransformationContext) => {
    const platformIndependentHost: IPlatformIndependentHost = {
      program,
      typeChecker: program.getTypeChecker(),
      transformationContext,
      pluginConfig,
      transformerExtras,
    };

    return (file: ts.SourceFile) => {
      const nodePlatformHost: ITransformerNodePlatformHost = {
        ...platformIndependentHost,
        schemaGenerator: createGenerator(platformIndependentHost, NodePlatformSchemaGenerator),
      };
      return visitNodeAndChildren(file, nodePlatformHost);
    };
  };
}
