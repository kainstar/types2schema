import { BaseEntity } from '../entity/base';

export function uniqueEntityArray<T extends BaseEntity>(types: T[]): T[] {
  const uniqueTypes = new Map<string, T>();
  for (const type of types) {
    uniqueTypes.set(type.getId(), type);
  }
  return Array.from(uniqueTypes.values());
}

export function uniqueArray<T>(array: readonly T[]): T[] {
  return array.reduce((result: T[], item: T) => {
    if (result.indexOf(item) < 0) {
      result.push(item);
    }

    return result;
  }, []);
}
