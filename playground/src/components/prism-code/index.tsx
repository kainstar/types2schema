import { highlightElement } from 'prismjs';
import { useEffect, useRef, VFC } from 'react';
import cn from 'classnames';

import 'prismjs/themes/prism-okaidia.css';

interface IProps {
  code: string;
  className?: string;
  language: string;
}

export const PrismCode: VFC<IProps> = ({ code, className, language }) => {
  const codeDOMRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeDOMRef.current) {
      highlightElement(codeDOMRef.current);
    }
  }, [code]);

  return (
    <pre ref={codeDOMRef} className={cn(`language-${language}`, className)}>
      {code}
    </pre>
  );
};
