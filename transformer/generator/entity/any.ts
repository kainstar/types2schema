import { BaseEntity } from './base';

export class AnyEntity extends BaseEntity {
  public getId() {
    return 'any';
  }
}
