import type { IntrinsicType, LiteralType, Type } from 'typescript';
import { BaseEntity } from '../../entity/base';
import { LiteralEntity } from '../../entity/literal';
import { IParser } from '../base';

export class LiteralTypeNodeParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    const TypeFlags = this.ts.TypeFlags;
    return !!(
      type.flags & TypeFlags.BooleanLiteral ||
      type.flags & TypeFlags.StringLiteral ||
      type.flags & TypeFlags.NumberLiteral
    );
  }

  public createEntity(type: Type): BaseEntity {
    const TypeFlags = this.ts.TypeFlags;

    // true | false has no value property
    const hasIntrinsicName = !!(type.flags & TypeFlags.Intrinsic);
    const value = hasIntrinsicName
      ? (type as IntrinsicType).intrinsicName === 'true'
        ? true
        : false
      : ((type as LiteralType).value as number | string);
    return new LiteralEntity(value, { type });
  }
}
