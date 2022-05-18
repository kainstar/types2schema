import type { Type } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { BooleanEntity } from '../../entity/boolean';
import { IParser } from '../base';

export class BooleanTypeParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    // boolean keyword 在类型系统中会被打上 boolean、union 两种 flag 标志，表示 true | false
    return !!(type.flags & this.ts.TypeFlags.Boolean);
  }

  public createEntity(type: Type): BaseEntity {
    return new BooleanEntity({ type });
  }
}
