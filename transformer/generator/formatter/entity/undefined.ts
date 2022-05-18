import { JSONSchema7 } from 'json-schema';

import { TransformerError } from '../../../error';
import { BaseEntity } from '../../entity/base';
import { UndefinedEntity } from '../../entity/undefined';
import { ISubFormatter } from '../base';

/**
 * Undefined 正常情况下不被转换，只有作为对象属性时会手动处理
 */
export class UndefinedEntityFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof UndefinedEntity;
  }

  getDefinition(_entity: BaseEntity): JSONSchema7 {
    throw new TransformerError('Undefined is not a transformed type.');
  }
  getChildren(_entity: BaseEntity): BaseEntity[] {
    throw new TransformerError('Undefined is not a transformed type.');
  }
}
