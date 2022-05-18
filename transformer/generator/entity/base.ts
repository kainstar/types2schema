import type { Type, Node } from 'typescript';

export interface ITsMeta {
  type: Type;
  node?: Node;
}

export abstract class BaseEntity {
  constructor(public tsMeta: ITsMeta) {}

  public getId(): string {
    return this.tsMeta.type.id.toString();
  }

  public toJSON() {
    const { tsMeta: _, ...rest } = this;
    return {
      entityType: Object.getPrototypeOf(this).constructor.name,
      id: this.getId(),
      name: this.getDefinitionName(),
      ...rest,
    };
  }

  /**
   * Get the definition name of the type. Override for non-basic types.
   */
  public getDefinitionName(): string {
    return this.getId();
  }
}
