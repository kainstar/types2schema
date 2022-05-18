import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { NumberEntity } from '../../entity/number';
import { ISubFormatter } from '../base';

export class NumberEntityFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof NumberEntity;
  }

  public getDefinition(): JSONSchema7 {
    return {
      type: 'number',
    };
  }

  public getChildren(): BaseEntity[] {
    return [];
  }
}
