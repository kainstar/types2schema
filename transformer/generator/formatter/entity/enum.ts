import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { EnumEntity } from '../../entity/enum';
import { groupBy } from '../../utils/group-by';
import { uniqueArray } from '../../utils/unique';
import { ISubFormatter } from '../base';

export class EnumFormatter implements ISubFormatter {
  public support(entity: BaseEntity): boolean {
    return entity instanceof EnumEntity;
  }

  public getDefinition(entity: EnumEntity): JSONSchema7 {
    const values = uniqueArray(entity.getValues());

    const typeGroupedValues = groupBy(values, (v) => typeof v);

    const typedEnumsGroup: JSONSchema7[] = [
      ...Object.keys(typeGroupedValues).map((type) => {
        return {
          type: type as 'string' | 'number' | 'boolean',
          enum: typeGroupedValues[type],
        };
      }),
    ];

    return {
      anyOf: typedEnumsGroup,
    };
  }

  public getChildren(_: EnumEntity): BaseEntity[] {
    return [];
  }
}
