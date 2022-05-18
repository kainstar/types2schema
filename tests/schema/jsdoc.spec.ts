import { schema } from '../../';
import { findDefinitionByProperty, findRootDefinition } from '../utils/schema';

describe('JSDoc Annotation', () => {
  it('Property Annotation', () => {
    interface IAnnotation {
      /**
       * @pattern ^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$
       */
      str: string;
    }

    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const pattern = findDefinitionByProperty(objectSchema, rootDefinition, 'str')?.pattern;

    expect(pattern).toBe('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$');
  });

  it('Interface Declaration Annotation', () => {
    /**
     * @minProperties 1
     */
    interface IAnnotation {
      str: string;
    }

    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const minProperties = rootDefinition?.minProperties;

    expect(minProperties).toBe(1);
  });

  it('Type Alias Declaration Annotation', () => {
    /**
     * @minProperties 1
     */
    type IAnnotation = {
      str: string;
    };

    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const minProperties = rootDefinition?.minProperties;

    expect(minProperties).toBe(1);
  });

  // 不支持混合属性 jsdoc 和对象 jsdoc 的使用方式，属性 tag 无法合并到对象的 definition 中，
  // 且在出现循环依赖时会无法解析

  it('Parse tag value as string', () => {
    interface IAnnotation {
      /**
       * @pattern ^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$
       */
      str: string;
    }

    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const pattern = findDefinitionByProperty(objectSchema, rootDefinition, 'str')?.pattern;

    expect(typeof pattern).toBe('string');
  });

  it('Parse tag value as number', () => {
    interface IAnnotation {
      /**
       * @minLength 1
       */
      str: string;
    }

    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const minLength = findDefinitionByProperty(objectSchema, rootDefinition, 'str')?.minLength;

    expect(typeof minLength).toBe('number');
  });

  it('Parse tag value as boolean', () => {
    interface IAnnotation {
      /**
       * @exclusiveMaximum true
       */
      num: number;
    }

    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const exclusiveMaximum = findDefinitionByProperty(objectSchema, rootDefinition, 'num')?.exclusiveMaximum;

    expect(typeof exclusiveMaximum).toBe('boolean');
  });

  it('Parse tag value as json', () => {
    interface IAnnotation {
      /**
       * @enum [1, 2, 3]
       */
      num: number;
    }
    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const numEnum = findDefinitionByProperty(objectSchema, rootDefinition, 'num')?.enum;

    expect(numEnum).toStrictEqual([1, 2, 3]);
  });

  it('Tag default value is true', () => {
    /**
     * @additionalProperties
     */
    interface IAnnotation {
      num: number;
    }

    const objectSchema = schema<IAnnotation>();
    const rootDefinition = findRootDefinition(objectSchema);
    const additionalProperties = rootDefinition?.additionalProperties;

    expect(additionalProperties).toBe(true);
  });
});
