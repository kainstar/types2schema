import { BaseEntity, ITsMeta } from './base';
import { LiteralEntity } from './literal';

export type EnumValue = string | boolean | number;

export class EnumEntity extends BaseEntity {
  constructor(private entities: LiteralEntity[], tsMeta: ITsMeta) {
    super(tsMeta);
  }

  public getValues(): readonly EnumValue[] {
    return this.entities.map((entity) => entity.getValue());
  }

  public getEntities(): BaseEntity[] {
    return this.entities;
  }
}
