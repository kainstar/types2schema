import type { Declaration, Type, Symbol as TSSymbol, JSDocTagInfo, JSDocContainer, JSDocEnumTag } from 'typescript';

import { Annotations } from './entity/annotation';
import { getDeclarationFromSymbol, getDeclarationFromType } from './utils/declaration';

class AnnotationsReader {
  constructor(private ts: typeof import('typescript')) {}

  public getAnnotationsFromDeclaration(node: Declaration): Annotations | undefined {
    const tags = this.tryGetJsDocFromDeclaration(node) ?? this.ts.JsDoc.getJsDocTagsFromDeclarations([node]);

    const annotations = this.parseJsDocTags(tags);
    return Object.keys(annotations).length ? annotations : undefined;
  }

  public getAnnotationsFromType(type: Type): Annotations | undefined {
    const declaration = getDeclarationFromType(type);
    if (!declaration) {
      return undefined;
    }

    return this.getAnnotationsFromDeclaration(declaration);
  }

  public getAnnotationsFromSymbol(symbol: TSSymbol): Annotations | undefined {
    const declaration = getDeclarationFromSymbol(symbol);
    const tags: JSDocTagInfo[] = this.tryGetJsDocFromDeclaration(declaration) ?? symbol.getJsDocTags();

    if (!tags || !tags.length) {
      return undefined;
    }

    const annotations = this.parseJsDocTags(tags);
    return Object.keys(annotations).length ? annotations : undefined;
  }

  /**
   * 部分特殊 tag（如 enum、type 等）会被解析为特殊的 tag 对象，
   * 这类对象上没有 comment 信息（被转化为了 typeExpression），
   * 因此需要通过解析 node 方式获取
   */
  private tryGetJsDocFromDeclaration(declaration?: Declaration) {
    try {
      return (declaration as JSDocContainer)?.jsDoc?.[0].tags?.map((tag) => ({
        name: tag.tagName.getText(),
        text: tag.comment ?? (tag as JSDocEnumTag)?.typeExpression?.getText(),
      }));
    } catch {
      return null;
    }
  }

  private parseJsDocTags(jsDocTags: JSDocTagInfo[]) {
    return jsDocTags.reduce((result: Annotations, jsDocTag) => {
      const value = this.parseJsDocTagValue(jsDocTag);
      if (value !== undefined) {
        result[jsDocTag.name] = value;
      }

      return result;
    }, {});
  }

  private parseJsDocTagValue(jsDocTag: JSDocTagInfo): unknown {
    const value = jsDocTag.text;

    /**
     * 默认为 Boolean 值 true
     * @example `@uniqueItems` -> "uniqueItems": true
     */
    if (!value) {
      return true;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}

let annotationsReaderSingleton: AnnotationsReader | null = null;

export const getAnnotationReaderSingleton = (ts: typeof import('typescript')) => {
  if (!annotationsReaderSingleton) {
    annotationsReaderSingleton = new AnnotationsReader(ts);
  }
  return annotationsReaderSingleton;
};
