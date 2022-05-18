import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { StringEntity } from '../../entity/string';
import { ISubFormatter } from '../base';

export class StringEntityFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof StringEntity;
  }

  public getDefinition(): JSONSchema7 {
    return {
      type: 'string',
    };
  }

  public getChildren(): BaseEntity[] {
    return [];
  }
}
