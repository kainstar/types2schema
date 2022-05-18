import type { ObjectLiteralExpression, ReturnStatement } from 'typescript';

export function parseCodeToExpression(code: string, ts: typeof import('typescript')) {
  const sourceFile = ts.createSourceFile('', `return ${code}`, ts.ScriptTarget.Latest);
  const returnStatement = sourceFile.statements[0] as ReturnStatement;
  return returnStatement.expression;
}

export function transformObjectToExpression(obj: object, ts: typeof import('typescript')) {
  return parseCodeToExpression(JSON.stringify(obj), ts) as ObjectLiteralExpression;
}
