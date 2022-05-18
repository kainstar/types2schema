import * as Monaco from 'monaco-editor';
import { useCallback, useMemo } from 'react';
import { Subscription, useSubscription } from 'use-subscription';

export function useMonacoModel(model: Monaco.editor.ITextModel) {
  const subscription = useMemo<Subscription<string>>(
    () => ({
      getCurrentValue: () => model.getValue(),
      subscribe: (callback) => {
        const disposeDidChangeContent = model.onDidChangeContent(callback);
        return () => disposeDidChangeContent.dispose();
      },
    }),
    [model]
  );

  const value = useSubscription(subscription);

  const setValue = useCallback((v: string) => model.setValue(v), [model]);

  return {
    value,
    model,
    setValue,
  };
}
