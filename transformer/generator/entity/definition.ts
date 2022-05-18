import { BaseEntity } from './base';

export class DefinitionEntity extends BaseEntity {
  private entity: BaseEntity | null = null;

  private id: string | null = null;

  private name: string | null = null;

  public getId() {
    if (this.id == null) {
      throw new Error('Reference type ID not set yet');
    }
    return this.id;
  }

  private setId(id: string): void {
    this.id = id;
  }

  public getDefinitionName(): string {
    if (this.name == null) {
      throw new Error('Reference type name not set yet');
    }
    return this.name;
  }

  private setName(name: string): void {
    this.name = name;
  }

  public getEntity(): BaseEntity {
    if (this.entity == null) {
      throw new Error('Reference type not set yet');
    }
    return this.entity;
  }

  public setEntity(entity: BaseEntity): void {
    this.entity = entity;
    this.setId(entity.getId());
    this.setName(entity.getDefinitionName());
  }
}
