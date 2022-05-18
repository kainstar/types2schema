import type { ElementFlags } from 'typescript';

import { BaseEntity, ITsMeta } from './base';

export class TupleElement {
  constructor(private entity: BaseEntity, private elementFlag: ElementFlags, private ts: typeof import('typescript')) {}

  public getEntity(): BaseEntity {
    return this.entity;
  }

  public isRequired(): boolean {
    return !!(this.elementFlag & this.ts.ElementFlags.Required);
  }

  public isOptional(): boolean {
    return !!(this.elementFlag & this.ts.ElementFlags.Optional);
  }

  public isRest(): boolean {
    return !!(this.elementFlag & this.ts.ElementFlags.Rest);
  }
}

export class TupleEntity extends BaseEntity {
  constructor(private elements: TupleElement[], tsMeta: ITsMeta) {
    super(tsMeta);
  }

  public getElements(): TupleElement[] {
    return this.elements;
  }
}
