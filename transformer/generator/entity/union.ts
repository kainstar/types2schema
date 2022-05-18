import { BaseEntity, ITsMeta } from './base';

import { uniqueEntityArray } from '../utils/unique';

export class UnionEntity extends BaseEntity {
  private readonly entities: BaseEntity[];

  constructor(entities: readonly BaseEntity[], tsMeta: ITsMeta) {
    super(tsMeta);
    this.entities = uniqueEntityArray(
      entities.reduce((flatTypes, entity) => {
        if (entity instanceof UnionEntity) {
          flatTypes.push(...entity.getEntities());
        } else if (entity !== undefined) {
          flatTypes.push(entity);
        }
        return flatTypes;
      }, [] as BaseEntity[])
    );
  }

  public getEntities(): BaseEntity[] {
    return this.entities;
  }

  // public unionLiteralsToEnum(entities: BaseEntity[]): BaseEntity[] {
  //   const literalEntities = entities.filter((entity): entity is LiteralEntity => entity instanceof LiteralEntity);
  //   const nonLiteralEntities = entities.filter((entity) => !(entity instanceof LiteralEntity));
  //   return [new EnumEntity(literalEntities, {}), ...nonLiteralEntities];
  // }
}
