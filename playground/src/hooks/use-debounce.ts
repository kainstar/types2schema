import { useUnmount } from './lifecycle';
import type { DebounceSettings } from 'lodash-es';
import { debounce } from 'lodash-es';
import { DependencyList, EffectCallback, useEffect, useMemo, useState } from 'react';

import { useCallbackRef } from './use-callback-ref';

interface IDebounceOptions extends DebounceSettings {
  wait: number;
}

export function useDebounceFn<T extends (...args: any[]) => any>(fn: T, options: IDebounceOptions) {
  const { wait, leading, trailing = true, maxWait } = options;

  const invoke = useCallbackRef(fn);

  const debounceFn = useMemo(
    () =>
      debounce(invoke, wait, {
        leading,
        trailing,
        maxWait,
      }),
    [invoke, wait, leading, trailing, maxWait]
  );

  return debounceFn;
}

export function useDebounceValue<T>(value: T, options: IDebounceOptions) {
  const [debounceValue, setDebounceValue] = useState(value);

  const debouncedValueSetter = useDebounceFn(() => setDebounceValue(value), options);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(debouncedValueSetter, [value]);

  return debounceValue;
}

interface IDebounceEffectOptions extends IDebounceOptions {
  /** 特定的 Effect hooks，可用于替换为 useDidUpdate 等自定义生命周期 hooks */
  useSpecialEffect?: (effect: EffectCallback, deps?: DependencyList) => void;
}

export function useDebounceEffect(effect: EffectCallback, options: IDebounceEffectOptions, deps?: DependencyList) {
  const { useSpecialEffect = useEffect, ...debounceOptions } = options;
  const debounceFn = useDebounceFn(effect, debounceOptions);

  useSpecialEffect(() => {
    return debounceFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useUnmount(debounceFn.cancel);
}
