import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { DefinitionEntity } from '../../entity/definition';
import { uniqueArray } from '../../utils/unique';
import { IFormatter, ISubFormatter } from '../base';

export class DefinitionEntityFormatter implements ISubFormatter {
  constructor(private formatter: IFormatter) {}

  public support(entity: BaseEntity): boolean {
    return entity instanceof DefinitionEntity;
  }

  public getDefinition(entity: DefinitionEntity): JSONSchema7 {
    return {
      $ref: `#/definitions/${entity.getDefinitionName()}`,
    };
  }

  public getChildren(entity: DefinitionEntity): BaseEntity[] {
    return uniqueArray([entity, ...this.formatter.getChildren(entity.getEntity())]);
  }
}
