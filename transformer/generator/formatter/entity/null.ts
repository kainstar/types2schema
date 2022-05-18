import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { NullEntity } from '../../entity/null';
import { ISubFormatter } from '../base';

export class NullEntityFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof NullEntity;
  }

  public getDefinition(): JSONSchema7 {
    return {
      type: 'null',
    };
  }

  public getChildren(): BaseEntity[] {
    return [];
  }
}
