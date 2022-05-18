import { BaseEntity, ITsMeta } from './base';

import { formatQualifiedName } from '../utils/format-qualified-name';
import { strip } from '../utils/strip';

export class ObjectProperty {
  constructor(private name: string, private entity: BaseEntity, private required: boolean) {}

  public getName(): string {
    return strip(this.name);
  }
  public getEntity(): BaseEntity {
    return this.entity;
  }
  public isRequired(): boolean {
    return this.required;
  }
}

export class ObjectEntity extends BaseEntity {
  constructor(
    private properties: readonly ObjectProperty[],
    private additionalProperties: BaseEntity | boolean,
    tsMeta: ITsMeta
  ) {
    super(tsMeta);
  }

  public getDefinitionName() {
    try {
      const namedSymbol = this.tsMeta.type.aliasSymbol ?? this.tsMeta.type.symbol;
      const fullyQualifiedName = formatQualifiedName(this.tsMeta.type.checker.getFullyQualifiedName(namedSymbol));
      return `${fullyQualifiedName}(${super.getDefinitionName()})`;
    } catch {
      return super.getDefinitionName();
    }
  }

  public getProperties(): readonly ObjectProperty[] {
    return this.properties;
  }

  public getAdditionalProperties(): BaseEntity | boolean {
    return this.additionalProperties;
  }
}
