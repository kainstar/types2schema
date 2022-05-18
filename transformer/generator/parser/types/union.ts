import type { TypeChecker, Type, UnionType } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { UnionEntity } from '../../entity/union';
import { getDeclarationFromType } from '../../utils/declaration';
import { notUndefined } from '../../utils/not-undefined';
import { IParser } from '../base';

export class UnionParser implements IParser {
  public constructor(
    private typeChecker: TypeChecker,
    private childParser: IParser,
    private ts: typeof import('typescript')
  ) {}

  public supports(type: Type): boolean {
    return type.isUnion();
  }

  public createEntity(type: UnionType): BaseEntity {
    const types = type.types
      .map((subType) => {
        return this.childParser.createEntity(subType);
      })
      .filter(notUndefined);

    return new UnionEntity(types, { node: getDeclarationFromType(type), type });
  }
}
