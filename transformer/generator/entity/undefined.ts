import { BaseEntity } from './base';

/**
 * UndefinedEntity has no Formatter, it only use to:
 * - optional calc when object property is union type
 */
export class UndefinedEntity extends BaseEntity {
  public getId() {
    return 'undefined';
  }
}
