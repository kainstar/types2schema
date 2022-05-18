import { PrimitiveEntity } from './primitive';

export class NumberEntity extends PrimitiveEntity {
  public getId() {
    return 'number';
  }
}
