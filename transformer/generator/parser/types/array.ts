import type { ObjectType, Type, TypeChecker, TypeReference } from 'typescript';
import { TransformerError } from '../../../error';
import { ArrayEntity } from '../../entity/array';
import { BaseEntity } from '../../entity/base';
import { IParser } from '../base';

export class ArrayTypeParser implements IParser {
  constructor(
    private childParser: IParser,
    private typeChecker: TypeChecker,
    private ts: typeof import('typescript')
  ) {}

  public supports(type: Type): boolean {
    return this.typeChecker.isArrayType(type) && !!((type as ObjectType).objectFlags & this.ts.ObjectFlags.Reference);
  }

  public createEntity(type: TypeReference): BaseEntity {
    const node = type.node;
    const elementType = type.typeArguments ? type.typeArguments[0] : undefined;
    if (!elementType) {
      throw new TransformerError(`Illegal Array Node Type`, node);
    }
    const entity = this.childParser.createEntity(elementType);
    return new ArrayEntity(entity, { node, type });
  }
}
