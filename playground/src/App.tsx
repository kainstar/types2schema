import { MonacoEditor } from './components/editor';
import { Output } from './components/output';

import style from './style.module.scss';

export const App = () => {
  return (
    <>
      <header className={style.header}>
        Types2schema Playground
        <div className={style.actions}>
          <a className={style.link} href="https://github.com/kainstar/types2schema" target="_blank">
            Github
          </a>
        </div>
      </header>
      <main className={style.main}>
        <div className={style.editorBox}>
          <div className={style.help}>
            <p>说明：schema 函数为内置函数，可以将 TS 类型转化为 JSON Schema 数据，使用方法请看下方代码示例</p>
          </div>
          <MonacoEditor className={style.editor} />
        </div>
        <div className={style.output}>
          <Output />
        </div>
      </main>
    </>
  );
};
