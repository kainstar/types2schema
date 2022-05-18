import type { PropertyDeclaration, PropertySignature, Type, TypeChecker, ObjectType } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { ObjectEntity, ObjectProperty } from '../../entity/object';
import { getDeclarationFromSymbol, getDeclarationFromType } from '../../utils/declaration';
import { wrapAnnotationBySymbol } from '../../utils/wrap-annotation';
import { IParser } from '../base';

export class ObjectParser implements IParser {
  constructor(
    private typeChecker: TypeChecker,
    private childParser: IParser,
    private ts: typeof import('typescript')
  ) {}
  supports(type: Type): boolean {
    return type.flags === this.ts.TypeFlags.Object && !this.typeChecker.isArrayLikeType(type);
  }

  createEntity(type: ObjectType) {
    const properties = this.getProperties(type);

    const additionalProperties = this.getAdditionalProperties(type);

    return new ObjectEntity(properties, additionalProperties, { node: getDeclarationFromType(type), type });
  }

  private getProperties(type: ObjectType) {
    const propertySymbols = this.typeChecker.getPropertiesOfType(type).filter((propertySymbol) => {
      return propertySymbol.flags & this.ts.SymbolFlags.Property;
    });

    const properties = propertySymbols.map((propertySymbol) => {
      const { name } = propertySymbol;
      const declaration = getDeclarationFromSymbol(propertySymbol) as PropertySignature | PropertyDeclaration;

      const required = !declaration.questionToken;
      const propertyType = this.typeChecker.getTypeOfSymbolAtLocation(propertySymbol, declaration);
      const propertyEntity = this.childParser.createEntity(propertyType);
      const propertyAnnotationEntity = wrapAnnotationBySymbol(propertyEntity, propertySymbol, this.ts);

      return new ObjectProperty(name, propertyAnnotationEntity, required);
    });
    return properties;
  }

  private getAdditionalProperties(type: ObjectType): BaseEntity | boolean {
    const IndexKind = this.ts.IndexKind;
    const signatureIndexInfo =
      this.typeChecker.getIndexInfoOfType(type, IndexKind.Number) ??
      this.typeChecker.getIndexInfoOfType(type, IndexKind.String);

    if (!signatureIndexInfo) {
      return false;
    }
    return wrapAnnotationBySymbol(
      this.childParser.createEntity(signatureIndexInfo.type),
      signatureIndexInfo.declaration?.symbol,
      this.ts
    );
  }
}
