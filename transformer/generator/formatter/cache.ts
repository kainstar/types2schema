import { JSONSchema7 } from 'json-schema';

import { ISubFormatter } from './base';

import { BaseEntity } from '../entity/base';
import { uniqueArray } from '../utils/unique';

export class FormatterCacheDecorator implements ISubFormatter {
  private definition = new Map<BaseEntity, JSONSchema7>();
  private children = new Map<BaseEntity, BaseEntity[]>();

  constructor(private formatter: ISubFormatter) {}

  public support(entity: BaseEntity): boolean {
    return this.formatter.support(entity);
  }

  public getDefinition(entity: BaseEntity): JSONSchema7 {
    if (this.definition.has(entity)) {
      return this.definition.get(entity)!;
    }

    const definition: JSONSchema7 = {};
    this.definition.set(entity, definition);
    Object.assign(definition, this.formatter.getDefinition(entity));
    return definition;
  }

  public getChildren(entity: BaseEntity): BaseEntity[] {
    if (this.children.has(entity)) {
      return this.children.get(entity)!;
    }

    const children: BaseEntity[] = [];
    this.children.set(entity, children);
    children.push(...this.formatter.getChildren(entity));
    return uniqueArray(children);
  }
}
