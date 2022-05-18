import type { DiagnosticWithLocation, Node } from 'typescript';

const TS_JSON_SCHEMA_PARSE_ERROR_CODE = -1001;

export class TransformerError extends Error {
  constructor(message: string, public node?: Node) {
    super(message);
  }

  public fillNodeIfEmpty(node: Node) {
    this.node = this.node ?? node;
  }
}

export function createDiagnosticsForError(error: TransformerError, ts: typeof import('typescript')) {
  const { message, node } = error;
  // sourceFile must exist after call `fillNodeIfEmpty`
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const sourceFile = node?.getSourceFile()!;
  const fullMessage = `[Types2schema] ${message}`;
  const diagnostic: DiagnosticWithLocation = {
    category: ts.DiagnosticCategory.Error,
    code: TS_JSON_SCHEMA_PARSE_ERROR_CODE,
    file: sourceFile,
    start: node?.getStart(sourceFile) ?? 1,
    messageText: fullMessage,
    // red error underline length
    length: node?.getText().length ?? 0,
  };

  return diagnostic;
}
