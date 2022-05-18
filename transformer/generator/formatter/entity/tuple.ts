import { JSONSchema7 } from 'json-schema';

import { TransformerError } from '../../../error';
import { BaseEntity } from '../../entity/base';
import { TupleEntity } from '../../entity/tuple';
import { UnionEntity } from '../../entity/union';
import { derefEntity } from '../../utils/deref';
import { removeUndefinedEntity } from '../../utils/remove-undefined-entity';
import { uniqueArray } from '../../utils/unique';
import { IFormatter, ISubFormatter } from '../base';

export class TupleEntityFormatter implements ISubFormatter {
  constructor(private formatter: IFormatter) {}

  public support(entity: BaseEntity): boolean {
    return entity instanceof TupleEntity;
  }

  public getDefinition(entity: TupleEntity): JSONSchema7 {
    const elements = entity.getElements();

    // [Item]
    const requiredElements = elements.filter((e) => e.isRequired());
    // [Item?]
    const optionalElements = elements.filter((e) => e.isOptional());
    // [...Item]
    const restElements = elements.filter((e) => e.isRest());

    const hasRestElement = restElements.length > 0;
    if (hasRestElement && restElements.length > 1) {
      // [Item, ...Item[], ...Item[]]
      throw new TransformerError(`Can't create schema for tuple which has more than one restType`, entity.tsMeta.node);
    }
    if (hasRestElement && elements.indexOf(restElements[0]) !== elements.length - 1) {
      // [Item, ...Item[], Item]
      throw new TransformerError(`Can't create schema for tuple where restType is not trailing`, entity.tsMeta.node);
    }

    const restArrayItemEntity = hasRestElement ? restElements[0].getEntity() : undefined;

    const requiredDefinitions = requiredElements.map((item) => this.formatter.getDefinition(item.getEntity()));
    const optionalDefinitions = optionalElements.map((item) =>
      this.formatter.getDefinition(removeUndefinedEntity(derefEntity(item.getEntity()) as UnionEntity).newEntity)
    );
    const definiteItemCount = requiredElements.length + optionalElements.length;

    return {
      type: 'array',
      minItems: requiredElements.length,
      // has items
      ...(definiteItemCount ? { items: [...requiredDefinitions, ...optionalDefinitions] } : {}),
      // has rest items
      ...(restArrayItemEntity ? { additionalItems: this.formatter.getDefinition(restArrayItemEntity) } : {}),
      // no rest items, limit tuple size
      ...(!restArrayItemEntity && definiteItemCount ? { maxItems: definiteItemCount } : {}),
    };
  }

  public getChildren(entity: TupleEntity): BaseEntity[] {
    return uniqueArray(
      entity.getElements().reduce<BaseEntity[]>((result, item) => {
        const childEntity = item.isOptional()
          ? removeUndefinedEntity(derefEntity(item.getEntity()) as UnionEntity).newEntity
          : item.getEntity();
        return [...result, ...this.formatter.getChildren(childEntity)];
      }, [])
    );
  }
}
