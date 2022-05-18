import { JSONSchema7 } from 'json-schema';

import { ArrayEntity } from '../../entity/array';
import { BaseEntity } from '../../entity/base';
import { IFormatter, ISubFormatter } from '../base';

export class ArrayEntityFormatter implements ISubFormatter {
  constructor(private formatter: IFormatter) {}

  public support(entity: BaseEntity): boolean {
    return entity instanceof ArrayEntity;
  }

  public getDefinition(entity: ArrayEntity): JSONSchema7 {
    return {
      type: 'array',
      items: this.formatter.getDefinition(entity.getItem()),
    };
  }

  public getChildren(entity: ArrayEntity): BaseEntity[] {
    return this.formatter.getChildren(entity.getItem());
  }
}
