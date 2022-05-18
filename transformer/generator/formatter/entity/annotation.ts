import { JSONSchema7 } from 'json-schema';

import { AnnotationEntity } from '../../entity/annotation';
import { BaseEntity } from '../../entity/base';
import { IFormatter, ISubFormatter } from '../base';

export class AnnotationEntityFormatter implements ISubFormatter {
  constructor(private formatter: IFormatter) {}

  public support(entity: BaseEntity): boolean {
    return entity instanceof AnnotationEntity;
  }

  public getDefinition(entity: AnnotationEntity): JSONSchema7 {
    return {
      ...this.formatter.getDefinition(entity.getEntity()),
      ...entity.getAnnotations(),
    };
  }

  public getChildren(entity: AnnotationEntity): BaseEntity[] {
    return this.formatter.getChildren(entity.getEntity());
  }
}
