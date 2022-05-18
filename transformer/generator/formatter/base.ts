import type { JSONSchema7 } from 'json-schema';
import { BaseEntity } from '../entity/base';

export interface IFormatter {
  getDefinition(entity: BaseEntity): JSONSchema7;
  getChildren(entity: BaseEntity): BaseEntity[];
}

export interface ISubFormatter extends IFormatter {
  support(entity: BaseEntity): boolean;
}
