export function groupBy<T, Keys extends string>(values: T[], iteratee: (v: T) => Keys) {
  const groupResult: Partial<Record<Keys, T[]>> = {};
  values.reduce((group, v) => {
    const groupName = iteratee(v);
    group[groupName] = group[groupName] || [];
    group[groupName]!.push(v);
    return group;
  }, groupResult);
  return groupResult;
}
