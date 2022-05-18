import { BaseEntity } from '../entity/base';

type IStringifyReplacer = (key: string, value: unknown) => unknown;

function getCircularReplacer(replacer?: IStringifyReplacer) {
  const seen = new WeakMap();
  let circularCount = 1;
  return function (key: string, value: unknown) {
    const replacedValue = replacer ? replacer(key, value) : value;
    if (typeof replacedValue === 'object' && replacedValue !== null) {
      if (seen.has(replacedValue)) {
        return `[Circular ${seen.get(replacedValue)}]`;
      }
      seen.set(replacedValue, circularCount++);
    }
    return replacedValue;
  };
}

export function circularJsonStringify(value: unknown, replacer?: IStringifyReplacer, space?: string | number) {
  return JSON.stringify(value, getCircularReplacer(replacer), space);
}

export function stringifyEntity(entity: BaseEntity) {
  return circularJsonStringify(
    entity,
    (key, value) => {
      return key === 'tsMeta' ? undefined : value;
    },
    2
  );
}
