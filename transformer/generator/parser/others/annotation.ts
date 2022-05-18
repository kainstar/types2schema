import type { Type } from 'typescript';

import { BaseEntity } from '../../entity/base';
import { getDeclarationFromType } from '../../utils/declaration';
import { wrapAnnotationByDeclaration } from '../../utils/wrap-annotation';
import { IParser } from '../base';

export class TypeAnnotationParser implements IParser {
  constructor(private childParser: IParser, private ts: typeof import('typescript')) {}

  public supports(type: Type): boolean {
    return this.childParser.supports(type);
  }

  public createEntity(type: Type): BaseEntity {
    const baseEntity = this.childParser.createEntity(type);
    const declarationNode = getDeclarationFromType(type);
    // 没有 AST node 节点，无法解析 jsdoc，直接返回
    if (!declarationNode) {
      return baseEntity;
    }

    return wrapAnnotationByDeclaration(baseEntity, declarationNode, this.ts);
  }
}
