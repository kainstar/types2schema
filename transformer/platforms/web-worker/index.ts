import type { Node, CallExpression, SourceFile, TransformationContext, TransformerFactory, Program } from 'typescript';

import { createDiagnosticsForError, TransformerError } from '../../error';
import { createGenerator, SchemaGenerator } from '../../generator';
import { IPlatformIndependentHost, TransformerExtras } from '../../types';
import { transformObjectToExpression } from '../../utils';

export const SCHEMA_METHOD_NAME = 'schema';

/** 检查是否为 schema 调用表达式 */
function isSchemaCallExpression(node: Node, ts: typeof import('typescript')): node is CallExpression {
  if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) {
    return false;
  }

  return node.expression.getText() === SCHEMA_METHOD_NAME;
}

/**
 * Main Transform Logic
 */
function transformNode(node: Node, host: ITransformerWebWorkerPlatformFileContext): Node {
  const {
    typeChecker,
    schemaGenerator,
    transformerExtras: { ts },
  } = host;

  if (!isSchemaCallExpression(node, ts)) {
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
      host.transformerExtras.addDiagnostic(diagnostic);
    } else {
      throw error;
    }
  }

  return node;
}

function visitNodeAndChildren(
  node: SourceFile,
  host: ITransformerWebWorkerPlatformFileContext,
  ts: typeof import('typescript')
): SourceFile;
function visitNodeAndChildren(
  node: Node,
  host: ITransformerWebWorkerPlatformFileContext,
  ts: typeof import('typescript')
): Node;

function visitNodeAndChildren(
  node: Node,
  host: ITransformerWebWorkerPlatformFileContext,
  ts: typeof import('typescript')
): Node {
  return ts.visitEachChild(
    transformNode(node, host),
    (childNode) => visitNodeAndChildren(childNode, host, ts),
    host.transformationContext
  );
}

interface IBrowserPlatformPluginConfig {
  debug?: boolean;
  logFile?: string;
}

interface ITransformerWebWorkerPlatformFileContext extends IPlatformIndependentHost<IBrowserPlatformPluginConfig> {
  schemaGenerator: SchemaGenerator;
}

export default function transformer(
  program: Program,
  pluginConfig: IBrowserPlatformPluginConfig,
  transformerExtras: TransformerExtras
): TransformerFactory<SourceFile> {
  return (transformationContext: TransformationContext) => {
    const platformIndependentHost: IPlatformIndependentHost = {
      program,
      typeChecker: program.getTypeChecker(),
      transformationContext,
      pluginConfig,
      transformerExtras,
    };
    return (file: SourceFile) => {
      const webWorkerPlatformHost: ITransformerWebWorkerPlatformFileContext = {
        ...platformIndependentHost,
        schemaGenerator: createGenerator(platformIndependentHost),
      };
      return visitNodeAndChildren(file, webWorkerPlatformHost, transformerExtras.ts);
    };
  };
}
