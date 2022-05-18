import { IParser } from './base';
import { TypeAnnotationParser } from './others/annotation';
import { ChainParser } from './others/chain';
import { ParserReuseDecorator } from './others/reuse';
import { AnyTypeParser } from './types/any';
import { ArrayTypeParser } from './types/array';
import { BooleanTypeParser } from './types/boolean';
import { EnumParser } from './types/enum';
import { IntersectionParser } from './types/intersection';
import { LiteralTypeNodeParser } from './types/literal-type';
import { MappedObjectParser } from './types/mapped-object';
import { NullTypeParser } from './types/null';
import { NumberTypeParser } from './types/number';
import { ObjectParser } from './types/object';
import { StringTypeParser } from './types/string';
import { TupleTypeParser } from './types/tuple';
import { UndefinedTypeParser } from './types/undefined';
import { UnionParser } from './types/union';

import { IPlatformIndependentHost } from '../../types';

export function createParser(host: IPlatformIndependentHost) {
  const {
    typeChecker,
    transformerExtras: { ts },
  } = host;
  const chainParser = new ChainParser();

  function withAnnotation(nodeParser: IParser): IParser {
    return new TypeAnnotationParser(nodeParser, ts);
  }

  function withReuse(nodeParser: IParser): IParser {
    return new ParserReuseDecorator(nodeParser);
  }

  chainParser
    .addParser(new AnyTypeParser(ts))
    .addParser(new NullTypeParser(ts))
    .addParser(new UndefinedTypeParser(ts))

    .addParser(new BooleanTypeParser(ts))
    .addParser(new StringTypeParser(ts))
    .addParser(new NumberTypeParser(ts))

    .addParser(new LiteralTypeNodeParser(ts))

    .addParser(withReuse(withAnnotation(new EnumParser(ts))))

    .addParser(withAnnotation(new UnionParser(typeChecker, chainParser, ts)))
    .addParser(withReuse(withAnnotation(new IntersectionParser(typeChecker, chainParser, ts))))
    .addParser(withReuse(withAnnotation(new MappedObjectParser(typeChecker, chainParser, ts))))
    .addParser(withReuse(withAnnotation(new ObjectParser(typeChecker, chainParser, ts))))
    .addParser(withAnnotation(new TupleTypeParser(typeChecker, chainParser, ts)))
    .addParser(withAnnotation(new ArrayTypeParser(chainParser, typeChecker, ts)));

  return chainParser;
}
