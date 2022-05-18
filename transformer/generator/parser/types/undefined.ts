import type { Type } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { UndefinedEntity } from '../../entity/undefined';
import { IParser } from '../base';

export class UndefinedTypeParser implements IParser {
  constructor(private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    return type.flags === this.ts.TypeFlags.Undefined;
  }

  public createEntity(type: Type): BaseEntity {
    return new UndefinedEntity({ type });
  }
}
