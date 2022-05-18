import { AnnotationEntity } from '../entity/annotation';
import { BaseEntity } from '../entity/base';
import { DefinitionEntity } from '../entity/definition';

export function derefEntity(entity: BaseEntity | undefined): BaseEntity | undefined {
  if (entity instanceof DefinitionEntity || entity instanceof AnnotationEntity) {
    return derefEntity(entity.getEntity());
  }
  return entity;
}

export function derefAnnotationEntity(entity: BaseEntity): BaseEntity {
  if (entity instanceof AnnotationEntity) {
    return derefAnnotationEntity(entity.getEntity());
  }
  return entity;
}
