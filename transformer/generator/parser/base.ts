import type { Type } from 'typescript';

import { BaseEntity } from '../entity/base';

export interface IParser {
  supports(type: Type): boolean;
  createEntity(type: Type): BaseEntity;
}
