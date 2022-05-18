import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { UnionEntity } from '../../entity/union';
import { uniqueArray } from '../../utils/unique';
import { IFormatter, ISubFormatter } from '../base';

export class UnionEntityFormatter implements ISubFormatter {
  constructor(private formatter: IFormatter) {}

  public support(entity: BaseEntity): boolean {
    return entity instanceof UnionEntity;
  }

  public getDefinition(entity: UnionEntity): JSONSchema7 {
    const subDefinitions = entity.getEntities().map((child) => this.formatter.getDefinition(child));

    return { anyOf: subDefinitions };
  }

  public getChildren(entity: UnionEntity): BaseEntity[] {
    return uniqueArray(
      entity.getEntities().reduce<BaseEntity[]>((result, item) => [...result, ...this.formatter.getChildren(item)], [])
    );
  }
}
