import type { Symbol as TSSymbol, Declaration } from 'typescript';

import { getAnnotationReaderSingleton } from '../annotation-reader';
import { AnnotationEntity } from '../entity/annotation';
import { BaseEntity } from '../entity/base';

export function wrapAnnotationBySymbol(
  baseEntity: BaseEntity,
  symbol: TSSymbol | undefined,
  ts: typeof import('typescript')
) {
  const annotationsReader = getAnnotationReaderSingleton(ts);
  const annotations = symbol ? annotationsReader.getAnnotationsFromSymbol(symbol) : null;
  return annotations ? new AnnotationEntity(baseEntity, annotations, baseEntity.tsMeta) : baseEntity;
}

export function wrapAnnotationByDeclaration(
  baseEntity: BaseEntity,
  declaration: Declaration | undefined,
  ts: typeof import('typescript')
) {
  const annotationsReader = getAnnotationReaderSingleton(ts);
  const annotations = declaration ? annotationsReader.getAnnotationsFromDeclaration(declaration) : null;
  return annotations ? new AnnotationEntity(baseEntity, annotations, baseEntity.tsMeta) : baseEntity;
}
