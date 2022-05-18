import type { Type, TypeId } from 'typescript';
import { BaseEntity } from '../../entity/base';
import { DefinitionEntity } from '../../entity/definition';
import { getDeclarationFromType } from '../../utils/declaration';
import { IParser } from '../base';

export class ParserReuseDecorator implements IParser {
  private store = new Map<TypeId, BaseEntity>();

  constructor(private childParser: IParser) {}

  public supports(type: Type): boolean {
    return this.childParser.supports(type);
  }

  public createEntity(type: Type): BaseEntity {
    const typeId = type.id;
    const declarationNode = getDeclarationFromType(type);
    if (!this.store.has(typeId)) {
      const definitionEntity = new DefinitionEntity({ type, node: declarationNode });
      // 先将 DefinitionEntity 放入 store 中，否则解析循环引用时会爆栈
      this.store.set(typeId, definitionEntity);
      const entity = this.childParser.createEntity(type);
      definitionEntity.setEntity(entity);
    }

    return this.store.get(typeId)!;
  }
}
