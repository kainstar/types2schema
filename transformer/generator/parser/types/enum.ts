import type { Type, LiteralType, UnionType } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { EnumEntity } from '../../entity/enum';
import { LiteralEntity } from '../../entity/literal';
import { getDeclarationFromType } from '../../utils/declaration';
import { IParser } from '../base';

export class EnumParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  supports(type: Type): boolean {
    return !!(type.flags & this.ts.TypeFlags.EnumLike);
  }

  createEntity(type: UnionType): BaseEntity {
    const memberTypes = type.types as LiteralType[];

    const memberEntities = memberTypes.map((memberType) => {
      const value = memberType.value as string | number;
      return new LiteralEntity(value, { type: memberType, node: memberType.symbol.valueDeclaration });
    });

    const declaration = getDeclarationFromType(type);
    return new EnumEntity(memberEntities, { node: declaration, type });
  }
}
