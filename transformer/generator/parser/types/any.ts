import type { IntrinsicType, Type } from 'typescript';

import { AnyEntity } from '../../entity/any';
import { BaseEntity } from '../../entity/base';
import { IParser } from '../base';

export class AnyTypeParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    // Exclude special type `error`
    return type.flags === this.ts.TypeFlags.Any && (type as IntrinsicType).intrinsicName !== 'error';
  }

  public createEntity(type: Type): BaseEntity {
    return new AnyEntity({ type });
  }
}
