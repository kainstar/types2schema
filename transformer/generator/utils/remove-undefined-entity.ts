import { derefAnnotationEntity } from './deref';
import { preserveAnnotation } from './preserve-annotation-entity';

import { BaseEntity } from '../entity/base';
import { UndefinedEntity } from '../entity/undefined';
import { UnionEntity } from '../entity/union';

export function removeUndefinedEntity(unionEntity: UnionEntity): {
  hasRemoved: boolean;
  newEntity: BaseEntity;
} {
  const entities: BaseEntity[] = [];
  let hasRemoved = false;

  for (const entity of unionEntity.getEntities()) {
    const newEntity = derefAnnotationEntity(entity);
    if (newEntity instanceof UndefinedEntity) {
      hasRemoved = true;
    } else if (newEntity instanceof UnionEntity) {
      const result = removeUndefinedEntity(newEntity);
      hasRemoved = hasRemoved || result.hasRemoved;
      entities.push(preserveAnnotation(entity, result.newEntity));
    } else {
      entities.push(entity);
    }
  }

  const newEntity =
    entities.length == 0
      ? new UndefinedEntity(unionEntity.tsMeta)
      : entities.length == 1
      ? entities[0]
      : new UnionEntity(entities, unionEntity.tsMeta);

  return {
    hasRemoved,
    newEntity,
  };
}
