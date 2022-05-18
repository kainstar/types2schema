import * as ts from 'typescript';

import { BaseEntity } from '../../entity/base';
import { TupleElement, TupleEntity } from '../../entity/tuple';
import { getDeclarationFromType } from '../../utils/declaration';
import { IParser } from '../base';

export class TupleTypeParser implements IParser {
  public constructor(
    private typeChecker: ts.TypeChecker,
    private childParser: IParser,
    private ts: typeof import('typescript')
  ) {}

  public supports(type: ts.Type): boolean {
    return this.typeChecker.isTupleType(type);
  }

  public createEntity(type: ts.TupleTypeReference): BaseEntity {
    const elements =
      type.resolvedTypeArguments?.map((elemType, index) => ({
        elementType: elemType,
        elementFlag: type.target.elementFlags[index],
      })) ?? [];

    return new TupleEntity(
      elements.map(({ elementType, elementFlag }) => {
        const elementEntity = this.childParser.createEntity(elementType);
        return new TupleElement(elementEntity, elementFlag, this.ts);
      }),
      {
        node: getDeclarationFromType(type),
        type,
      }
    );
  }
}
