import type { Type } from 'typescript';

import { TransformerError } from '../../../error';
import { BaseEntity } from '../../entity/base';
import { IParser } from '../base';

export class ChainParser implements IParser {
  private parsers: IParser[] = [];

  public addParser(parser: IParser) {
    this.parsers.push(parser);
    return this;
  }

  public supports(type: Type): boolean {
    return this.parsers.some((nodeParser) => nodeParser.supports(type));
  }

  public createEntity(type: Type): BaseEntity {
    return this.getSupportedParser(type).createEntity(type);
  }

  private getSupportedParser(type: Type): IParser {
    for (const parser of this.parsers) {
      if (parser.supports(type)) {
        return parser;
      }
    }

    throw new TransformerError(`Unsupported Type: ${type.checker.typeToString(type)}`);
  }
}
