import { AnnotationEntity } from '../entity/annotation';
import { BaseEntity } from '../entity/base';

/**
 * Return the new entity wrapped in an annotated entity with the same annotations as the original entity.
 * @param originalEntity The original entity. If this is an annotated entity,
 *      then the returned entity will be wrapped with the same annotations.
 * @param newEntity The entity to be wrapped.
 */
export function preserveAnnotation(originalEntity: BaseEntity, newEntity: BaseEntity): BaseEntity {
  if (originalEntity instanceof AnnotationEntity) {
    return new AnnotationEntity(newEntity, originalEntity.getAnnotations(), originalEntity.tsMeta);
  }
  return newEntity;
}
