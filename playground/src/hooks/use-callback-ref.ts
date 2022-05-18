import { useCallback, useRef } from 'react';

/**
 * 将 callback 函数存储到 ref 上，相当于 class 组件的函数方法；
 *
 * 内部没有缓存，保存的一直都是当前渲染的最新值，不会因为函数重新创建而发生重渲染
 *
 * @export
 * @template T
 * @param {T} [callback]
 * @returns
 */
export function useCallbackRef<T extends (...args: any[]) => any>(callback: T) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  const invoke = useCallback<(...args: any[]) => undefined | ReturnType<T>>(
    (...args) => {
      return callbackRef.current!(...args);
    },
    [callbackRef]
  );

  return invoke;
}
