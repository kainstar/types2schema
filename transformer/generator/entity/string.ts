import { PrimitiveEntity } from './primitive';

export class StringEntity extends PrimitiveEntity {
  public getId() {
    return 'string';
  }
}
