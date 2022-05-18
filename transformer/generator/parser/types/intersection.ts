import type { TypeChecker, Type, IntersectionType } from 'typescript';
import { BaseEntity } from '../../entity/base';
import { ObjectEntity, ObjectProperty } from '../../entity/object';
import { getDeclarationFromType } from '../../utils/declaration';
import { notUndefined } from '../../utils/not-undefined';
import { wrapAnnotationBySymbol } from '../../utils/wrap-annotation';
import { IParser } from '../base';

export class IntersectionParser implements IParser {
  constructor(
    private typeChecker: TypeChecker,
    private childParser: IParser,
    private ts: typeof import('typescript')
  ) {}

  public supports(type: Type) {
    return type.isIntersection();
  }

  public createEntity(type: IntersectionType) {
    const resolvedProperties = this.typeChecker
      .getPropertiesOfType(type)
      .map((propertySymbol) => {
        const isOptional = propertySymbol.flags & this.ts.SymbolFlags.Optional;
        const propertyType = this.typeChecker.getTypeOfPropertyOfType(type, propertySymbol.name);
        if (!propertyType) {
          return undefined;
        }
        const propertyEntity = this.childParser.createEntity(propertyType);
        return new ObjectProperty(
          propertySymbol.name,
          wrapAnnotationBySymbol(propertyEntity, propertySymbol, this.ts),
          !isOptional
        );
      })
      .filter(notUndefined);

    return new ObjectEntity(resolvedProperties, this.getAdditionalProperties(type), {
      node: getDeclarationFromType(type),
      type,
    });
  }

  private getAdditionalProperties(type: IntersectionType): BaseEntity | boolean {
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
