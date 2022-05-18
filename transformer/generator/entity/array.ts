import { BaseEntity, ITsMeta } from './base';

export class ArrayEntity extends BaseEntity {
  constructor(private item: BaseEntity, tsMeta: ITsMeta) {
    super(tsMeta);
  }

  public getItem(): BaseEntity {
    return this.item;
  }
}
