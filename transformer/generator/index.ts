import type { JSONSchema7 } from 'json-schema';
import type { Type, Node } from 'typescript';

import { BaseEntity } from './entity/base';
import { DefinitionEntity } from './entity/definition';
import { createFormatter } from './formatter';
import { IFormatter } from './formatter/base';
import { createParser } from './parser';
import { IParser } from './parser/base';

import { TransformerError } from '../error';
import { IPlatformIndependentHost } from '../types';

export class SchemaGenerator {
  constructor(private parser: IParser, private formatter: IFormatter) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onRootEntityCreated(_rootEntity: BaseEntity, _node: Node) {}

  public createSchema(type: Type, node: Node): JSONSchema7 {
    const rootEntity = this.parser.createEntity(type);
    this.onRootEntityCreated(rootEntity, node);

    if (!rootEntity) {
      throw new TransformerError(`Can't convert root node or type to entity`, node);
    }

    const rootDefinition = this.formatter.getDefinition(rootEntity);
    const definitions = {};
    this.appendChildrenDefinitions(rootEntity, definitions);

    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...(rootDefinition ?? {}),
      definitions,
    };
  }

  private appendChildrenDefinitions(rootEntity: BaseEntity, childDefinitions: Record<string, JSONSchema7>) {
    const scanned = new Set<string>();

    const childrenEntities = this.formatter
      .getChildren(rootEntity)
      .filter((entity): entity is DefinitionEntity => entity instanceof DefinitionEntity)
      .filter((entity) => {
        const has = scanned.has(entity.getId());
        if (!has) {
          scanned.add(entity.getId());
        }
        return !has;
      });

    childrenEntities.reduce((definitions, child) => {
      const name = child.getDefinitionName();
      if (!(name in definitions)) {
        definitions[name] = this.formatter.getDefinition(child.getEntity());
      }
      return definitions;
    }, childDefinitions);
  }
}

export function createGenerator(host: IPlatformIndependentHost, SchemaGeneratorImpl = SchemaGenerator) {
  const parser = createParser(host);
  const formatter = createFormatter(host);

  return new SchemaGeneratorImpl(parser, formatter);
}
