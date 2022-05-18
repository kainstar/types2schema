import { FormatterCacheDecorator } from './cache';
import { ChainFormatter } from './chain';
import { AnnotationEntityFormatter } from './entity/annotation';
import { AnyEntityFormatter } from './entity/any';
import { ArrayEntityFormatter } from './entity/array';
import { BooleanEntityFormatter } from './entity/boolean';
import { DefinitionEntityFormatter } from './entity/definition';
import { EnumFormatter } from './entity/enum';
import { LiteralEntityFormatter } from './entity/literal';
import { NullEntityFormatter } from './entity/null';
import { NumberEntityFormatter } from './entity/number';
import { ObjectEntityFormatter } from './entity/object';
import { StringEntityFormatter } from './entity/string';
import { TupleEntityFormatter } from './entity/tuple';
import { UndefinedEntityFormatter } from './entity/undefined';
import { UnionEntityFormatter } from './entity/union';

import { IPlatformIndependentHost } from '../../types';

export function createFormatter(_host: IPlatformIndependentHost) {
  const chainFormatter = new ChainFormatter();
  const entityCacheFormatter = new FormatterCacheDecorator(chainFormatter);

  chainFormatter
    .addFormatter(new AnnotationEntityFormatter(entityCacheFormatter))

    .addFormatter(new UndefinedEntityFormatter())
    .addFormatter(new StringEntityFormatter())
    .addFormatter(new NumberEntityFormatter())
    .addFormatter(new BooleanEntityFormatter())
    .addFormatter(new NullEntityFormatter())

    .addFormatter(new AnyEntityFormatter())

    .addFormatter(new LiteralEntityFormatter())
    .addFormatter(new EnumFormatter())

    .addFormatter(new DefinitionEntityFormatter(entityCacheFormatter))
    .addFormatter(new ObjectEntityFormatter(entityCacheFormatter))

    .addFormatter(new ArrayEntityFormatter(entityCacheFormatter))
    .addFormatter(new TupleEntityFormatter(entityCacheFormatter))
    .addFormatter(new UnionEntityFormatter(entityCacheFormatter));

  return entityCacheFormatter;
}
