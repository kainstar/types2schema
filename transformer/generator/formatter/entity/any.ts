import { JSONSchema7 } from 'json-schema';

import { AnyEntity } from '../../entity/any';
import { BaseEntity } from '../../entity/base';
import { ISubFormatter } from '../base';

export class AnyEntityFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof AnyEntity;
  }

  public getDefinition(_entity: AnyEntity): JSONSchema7 {
    return {};
  }

  public getChildren(_entity: AnyEntity): BaseEntity[] {
    return [];
  }
}
