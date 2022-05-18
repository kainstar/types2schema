import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { LiteralEntity } from '../../entity/literal';
import { ISubFormatter } from '../base';

export class LiteralEntityFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof LiteralEntity;
  }

  public getDefinition(entity: LiteralEntity): JSONSchema7 {
    const value = entity.getValue();
    return {
      type: typeof value as 'string' | 'number' | 'boolean',
      enum: [value],
    };
  }

  public getChildren(): BaseEntity[] {
    return [];
  }
}
