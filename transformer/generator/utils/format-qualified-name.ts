// import * as path from 'path';

// const PathSepReg = new RegExp(`\\${path.sep}`, 'g');
// TODO: platform compat
const PathSepReg = new RegExp(`\\/`, 'g');
const FirstPathSepReg = /^-/;
const QuoteReg = /"/g;

export function formatQualifiedName(qualifiedName: string) {
  return qualifiedName.replace(PathSepReg, '-').replace(QuoteReg, '').replace(FirstPathSepReg, '');
}
