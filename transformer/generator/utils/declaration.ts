import type { Type, Symbol as TSSymbol } from 'typescript';

export function getDeclarationFromSymbol(symbol?: TSSymbol) {
  return symbol?.valueDeclaration ?? symbol?.declarations?.[0];
}

export function getDeclarationFromType(type: Type) {
  const symbol = type.aliasSymbol ?? type.symbol;
  return getDeclarationFromSymbol(symbol);
}
