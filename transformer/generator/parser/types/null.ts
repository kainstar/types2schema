import type { Type } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { NullEntity } from '../../entity/null';
import { IParser } from '../base';

export class NullTypeParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    return type.flags === this.ts.TypeFlags.Null;
  }

  public createEntity(type: Type): BaseEntity {
    return new NullEntity({ type });
  }
}
