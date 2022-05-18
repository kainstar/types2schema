import type { Type } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { NumberEntity } from '../../entity/number';
import { IParser } from '../base';

export class NumberTypeParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    return !!(type.flags & this.ts.TypeFlags.Number);
  }

  public createEntity(type: Type): BaseEntity {
    return new NumberEntity({ type });
  }
}
