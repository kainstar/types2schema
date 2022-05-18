import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Primitive type tests', () => {
  it('Null', () => {
    const primitiveSchema = schema<null>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate(null)).toBe(true);

    expect(validate(1)).toBe(false);
    expect(validate('string')).toBe(false);
    expect(validate(true)).toBe(false);
  });

  it('String', () => {
    const primitiveSchema = schema<string>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate('string')).toBe(true);

    expect(validate(1)).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate(true)).toBe(false);
  });

  it('Literal string', () => {
    const primitiveSchema = schema<'str'>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate('str')).toBe(true);

    expect(validate('string')).toBe(false);
    expect(validate(1)).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate(true)).toBe(false);
  });

  it('Number', () => {
    const primitiveSchema = schema<number>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate(1)).toBe(true);

    expect(validate('string')).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate(true)).toBe(false);
  });

  it('Literal number', () => {
    const primitiveSchema = schema<1>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate(1)).toBe(true);

    expect(validate(2)).toBe(false);
    expect(validate('string')).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate(true)).toBe(false);
  });

  it('Boolean', () => {
    const primitiveSchema = schema<boolean>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate(true)).toBe(true);
    expect(validate(false)).toBe(true);

    expect(validate(2)).toBe(false);
    expect(validate('string')).toBe(false);
    expect(validate(null)).toBe(false);
  });

  it('Literal booleans - true', () => {
    const primitiveSchema = schema<true>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate(true)).toBe(true);

    expect(validate(false)).toBe(false);
    expect(validate(2)).toBe(false);
    expect(validate('string')).toBe(false);
    expect(validate(null)).toBe(false);
  });

  it('Literal booleans - false', () => {
    const primitiveSchema = schema<false>();
    const validate = ajvInstance.compile(primitiveSchema);

    expect(validate(false)).toBe(true);

    expect(validate(true)).toBe(false);
    expect(validate(2)).toBe(false);
    expect(validate('string')).toBe(false);
    expect(validate(null)).toBe(false);
  });
});
