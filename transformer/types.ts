import type { Program, TypeChecker, TransformationContext } from 'typescript';
import type * as ts from 'typescript';

/**
 * copy from ts-patch, transformer extra params
 */
export type TransformerExtras = {
  /**
   * Originating TypeScript instance
   */
  ts: typeof ts;
  /**
   * TypeScript library file event was triggered in (ie. 'tsserverlibrary' or 'typescript')
   */
  library: string;
  addDiagnostic: (diag: ts.Diagnostic) => number;
  removeDiagnostic: (index: number) => void;
  diagnostics: readonly ts.Diagnostic[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPlatformIndependentTransformerPluginConfig {}

export interface IPlatformIndependentHost<PluginConfig = IPlatformIndependentTransformerPluginConfig> {
  program: Program;
  typeChecker: TypeChecker;
  transformationContext: TransformationContext;
  pluginConfig?: PluginConfig;
  transformerExtras: TransformerExtras;
}
