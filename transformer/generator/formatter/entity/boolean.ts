import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { BooleanEntity } from '../../entity/boolean';
import { ISubFormatter } from '../base';

export class BooleanEntityFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof BooleanEntity;
  }

  public getDefinition(): JSONSchema7 {
    return {
      type: 'boolean',
    };
  }

  public getChildren(): BaseEntity[] {
    return [];
  }
}
