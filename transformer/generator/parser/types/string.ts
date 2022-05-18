import type { Type } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { StringEntity } from '../../entity/string';
import { IParser } from '../base';

export class StringTypeParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    return !!(type.flags & this.ts.TypeFlags.String);
  }

  public createEntity(type: Type): BaseEntity {
    return new StringEntity({ type });
  }
}
