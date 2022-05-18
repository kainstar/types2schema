import { BaseEntity, ITsMeta } from './base';

export interface Annotations {
  [name: string]: unknown;
}

export class AnnotationEntity extends BaseEntity {
  constructor(private entity: BaseEntity, private annotations: Annotations, tsMeta: ITsMeta) {
    super(tsMeta);
  }

  public getId() {
    return this.entity.getId();
  }

  public getEntity(): BaseEntity {
    return this.entity;
  }

  public getAnnotations(): Annotations {
    return this.annotations;
  }
}
