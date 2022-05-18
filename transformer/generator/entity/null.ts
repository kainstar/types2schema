import { PrimitiveEntity } from './primitive';

export class NullEntity extends PrimitiveEntity {
  public getId() {
    return 'null';
  }
}
