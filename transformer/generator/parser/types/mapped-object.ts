import type { TypeChecker, Type, ObjectType, MappedType, MappedTypeNode } from 'typescript';

import { TransformerError } from '../../../error';
import { BaseEntity } from '../../entity/base';
import { EnumEntity } from '../../entity/enum';
import { LiteralEntity } from '../../entity/literal';
import { NumberEntity } from '../../entity/number';
import { ObjectEntity, ObjectProperty } from '../../entity/object';
import { StringEntity } from '../../entity/string';
import { UnionEntity } from '../../entity/union';
import { derefEntity } from '../../utils/deref';
import { notUndefined } from '../../utils/not-undefined';
import { IParser } from '../base';

export class MappedObjectParser implements IParser {
  constructor(
    private typeChecker: TypeChecker,
    private childParser: IParser,
    private ts: typeof import('typescript')
  ) {}

  supports(type: Type): boolean {
    return type.flags === this.ts.TypeFlags.Object && (type as ObjectType).objectFlags === this.ts.ObjectFlags.Mapped;
  }

  createEntity(type: MappedType) {
    const node = type.declaration;
    const keysTypeNode = node.typeParameter.constraint!;
    const keysType = this.typeChecker.getTypeAtLocation(keysTypeNode);
    const keysEntity = derefEntity(this.childParser.createEntity(keysType));
    if (keysEntity instanceof UnionEntity) {
      return new ObjectEntity(
        this.getPropertiesFromUnion(node, keysEntity),
        this.getAdditionalPropertiesFromUnion(node, keysEntity),
        { node, type }
      );
    } else if (keysEntity instanceof LiteralEntity) {
      return new ObjectEntity(
        [
          new ObjectProperty(
            keysEntity.getValue().toString(),
            this.getMappedValueTypeEntity(node),
            !node.questionToken
          ),
        ],
        false,
        { node, type }
      );
    } else if (keysEntity instanceof StringEntity || keysEntity instanceof NumberEntity) {
      return new ObjectEntity([], this.getMappedValueTypeEntity(node), { node, type });
    } else if (keysEntity instanceof EnumEntity) {
      return new ObjectEntity(this.getPropertiesFromEnum(node, keysEntity), false, { node, type });
    } else {
      throw new TransformerError(`Unexpected mapped type keys:${this.typeChecker.typeToString(keysType)}`, node);
    }
  }

  private getMappedValueTypeEntity(node: MappedTypeNode) {
    const additionalPropTypeNode = node.type!;
    const additionalPropType = this.typeChecker.getTypeAtLocation(additionalPropTypeNode);

    return this.childParser.createEntity(additionalPropType);
  }

  private getPropertiesFromUnion(node: MappedTypeNode, keysEntity: UnionEntity): ObjectProperty[] {
    const propertyEntity = this.getMappedValueTypeEntity(node);
    return keysEntity
      .getEntities()
      .filter((entity): entity is LiteralEntity => entity instanceof LiteralEntity)
      .reduce((result: ObjectProperty[], keyEntity: LiteralEntity) => {
        const objectProperty = new ObjectProperty(keyEntity.getValue().toString(), propertyEntity, !node.questionToken);

        result.push(objectProperty);
        return result;
      }, []);
  }

  private getPropertiesFromEnum(node: MappedTypeNode, keysEntity: EnumEntity): ObjectProperty[] {
    return keysEntity
      .getValues()
      .filter(notUndefined)
      .map((value) => {
        return new ObjectProperty(value.toString(), this.getMappedValueTypeEntity(node), !node.questionToken);
      });
  }

  private getAdditionalPropertiesFromUnion(node: MappedTypeNode, keysEntity: UnionEntity): BaseEntity | boolean {
    const additionalKey = keysEntity.getEntities().find((entity) => !(entity instanceof LiteralEntity));
    if (!additionalKey) {
      return false;
    }
    return this.getMappedValueTypeEntity(node);
  }
}
