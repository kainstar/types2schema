import { useEffect, useRef, VFC } from 'react';
import * as Monaco from 'monaco-editor';

import { useDidUpdate, useMount } from '../../hooks/lifecycle';
import { debounce } from 'lodash-es';
import { typescriptSandboxInstance } from '../../ts-sandbox';
import { useMonacoModel } from '../../hooks/use-monaco-model';

interface IProps {
  className?: string;
  editorOptions?: Monaco.editor.IEditorOptions;
}

Monaco.editor.setTheme('vs-dark');
Monaco.editor.EditorOptions.automaticLayout.defaultValue = true;

export const MonacoEditor: VFC<IProps> = ({ className, editorOptions }) => {
  const { model } = useMonacoModel(typescriptSandboxInstance.getCurrentTextModel());

  const editorContainerDOMRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  useMount(() => {
    if (!editorContainerDOMRef.current) {
      return;
    }

    const editorContainerDOM = editorContainerDOMRef.current;
    const editorInstance = Monaco.editor.create(editorContainerDOM, {
      ...editorOptions,
    });
    editorInstanceRef.current = editorInstance;

    // automaticLayout has problems, call layout method manually
    // https://github.com/microsoft/monaco-editor/issues/28
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        editorInstance.layout();
      }, 500)
    );

    resizeObserver.observe(editorContainerDOM);

    return () => {
      resizeObserver.unobserve(editorContainerDOM);
      editorInstance.dispose();
    };
  });

  useDidUpdate(() => {
    editorOptions && editorInstanceRef.current?.updateOptions(editorOptions);
  }, [editorOptions]);

  useEffect(() => {
    editorInstanceRef.current?.setModel(model);
  }, [model]);

  return <div className={className} ref={editorContainerDOMRef}></div>;
};
