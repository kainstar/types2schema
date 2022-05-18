import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

import { useCallbackRef } from './use-callback-ref';

/**
 * componentDidMount hooks
 */
export function useMount(fn: EffectCallback) {
  useEffect(fn, []);
}

/**
 * componentWillUnmount hooks
 */
export function useUnmount(fn: () => void) {
  const invoke = useCallbackRef(fn);

  useEffect(() => {
    return invoke;
  }, []);
}

/**
 * componentDidUpdate hooks
 */
export function useDidUpdate(fn: EffectCallback, deps?: DependencyList) {
  const ref = useRef(false);

  useEffect(
    ref.current
      ? fn
      : () => {
          ref.current = true;
        },
    deps
  );
}
