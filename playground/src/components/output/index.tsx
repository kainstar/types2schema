import { useObservableState } from 'observable-hooks';
import { switchMap, tap } from 'rxjs/operators';
import { useDebounceEffect } from '../../hooks/use-debounce';
import { useState, VFC } from 'react';
import { useMonacoModel } from '../../hooks/use-monaco-model';
import { ICompliedResult, typescriptSandboxInstance } from '../../ts-sandbox';
import { PrismCode } from '../prism-code';

import style from './style.module.scss';

interface IProps {}

export const Output: VFC<IProps> = () => {
  const { value } = useMonacoModel(typescriptSandboxInstance.getCurrentTextModel());
  const [loading, setLoading] = useState(true);

  const [compiledResult, reCompile] = useObservableState<ICompliedResult, void>(
    (input$) =>
      input$.pipe(
        tap(() => setLoading(true)),
        switchMap(() => typescriptSandboxInstance.getCompiledResult()),
        tap(() => setLoading(false))
      ),
    {
      diagnosticsMap: {
        semanticDiagnostics: [],
        syntacticDiagnostics: [],
      },
      jsCode: '',
    }
  );

  useDebounceEffect(
    () => reCompile(),
    {
      wait: 1000,
    },
    [value]
  );

  if (loading) {
    return <img className={style.loading} src="https://b.yzcdn.cn/public_files/d590a666785c97ba92ef885c8a997bc3.png" />;
  }

  const diagnostics = [
    ...(compiledResult?.diagnosticsMap?.semanticDiagnostics ?? []),
    ...(compiledResult?.diagnosticsMap?.syntacticDiagnostics ?? []),
  ];

  return (
    <>
      <section className={style.section}>
        <h2 className={style.title}>Compiled Code:</h2>
        <PrismCode code={compiledResult.jsCode} language="javascript" className={style.code} />
      </section>
      <section className={style.section}>
        <h2 className={style.title}>Diagnostics:</h2>
        <ul className={style.diagnostics}>
          {diagnostics.map((diagnostic) => {
            return (
              <li className={style.diagnostic}>
                [{diagnostic.code}]: {diagnostic.messageText}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};
