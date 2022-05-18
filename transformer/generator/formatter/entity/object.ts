import { JSONSchema7 } from 'json-schema';

import { BaseEntity } from '../../entity/base';
import { ObjectEntity, ObjectProperty } from '../../entity/object';
import { UndefinedEntity } from '../../entity/undefined';
import { UnionEntity } from '../../entity/union';
import { derefEntity } from '../../utils/deref';
import { notUndefined } from '../../utils/not-undefined';
import { preserveAnnotation } from '../../utils/preserve-annotation-entity';
import { removeUndefinedEntity } from '../../utils/remove-undefined-entity';
import { uniqueArray } from '../../utils/unique';
import { IFormatter, ISubFormatter } from '../base';

export class ObjectEntityFormatter implements ISubFormatter {
  constructor(private formatter: IFormatter) {}

  public support(entity: BaseEntity): boolean {
    return entity instanceof ObjectEntity;
  }

  /**
   * 对 property 属性进行预处理
   * - 若有 undefined 类型，则将其去除并设置改属性为非必须属性
   */
  private prepareObjectProperty(property: ObjectProperty) {
    const propertyEntity = property.getEntity();
    const derefedEntity = derefEntity(propertyEntity);

    // is undefined type only, skip this property
    if (derefedEntity instanceof UndefinedEntity) {
      return undefined;
    }

    if (!(derefedEntity instanceof UnionEntity)) {
      return property;
    }

    const { hasRemoved, newEntity } = removeUndefinedEntity(derefedEntity);

    if (hasRemoved) {
      return new ObjectProperty(property.getName(), preserveAnnotation(propertyEntity, newEntity), false);
    }

    return property;
  }

  public getDefinition(entity: ObjectEntity): JSONSchema7 {
    const objectProperties = entity.getProperties();
    const additionalProperties = entity.getAdditionalProperties();

    const preparedProperties = objectProperties
      .map((property) => this.prepareObjectProperty(property))
      .filter(notUndefined);

    const requiredPropNames = preparedProperties
      .filter((property) => property.isRequired())
      .map((property) => property.getName());

    const properties = preparedProperties.reduce((result: Record<string, JSONSchema7>, property) => {
      const propertyEntity = property.getEntity();

      if (propertyEntity !== undefined) {
        result[property.getName()] = this.formatter.getDefinition(propertyEntity);
      }

      return result;
    }, {});

    return {
      type: 'object',
      properties,
      required: requiredPropNames,
      additionalProperties:
        typeof additionalProperties === 'boolean'
          ? additionalProperties
          : this.formatter.getDefinition(additionalProperties),
    };
  }

  public getChildren(entity: ObjectEntity): BaseEntity[] {
    const properties = entity.getProperties();
    const additionalProperties = entity.getAdditionalProperties();

    const childrenOfAdditionalProps =
      additionalProperties instanceof BaseEntity ? this.formatter.getChildren(additionalProperties) : [];

    const childrenOfProps = properties
      .map((p) => this.prepareObjectProperty(p))
      .reduce<BaseEntity[]>((result, prop) => {
        if (!prop) {
          return result;
        }

        const propEntity = prop.getEntity();
        if (!propEntity) {
          return result;
        }

        return [...result, ...this.formatter.getChildren(propEntity)];
      }, []);

    return uniqueArray([...childrenOfAdditionalProps, ...childrenOfProps]);
  }
}
