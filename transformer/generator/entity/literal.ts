import { BaseEntity, ITsMeta } from './base';

export type LiteralValue = string | number | boolean;

export class LiteralEntity extends BaseEntity {
  constructor(private value: LiteralValue, tsMeta: ITsMeta) {
    super(tsMeta);
  }

  public getValue(): LiteralValue {
    return this.value;
  }
}
