import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Mapped Types Test', () => {
  it('Index type using union literal', () => {
    type Query = {
      [type in 'a' | 'b' | 'c']: string;
    };

    const objectSchema = schema<Query>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ a: 'string', b: 'string', c: 'string' })).toBe(true);

    expect(validate({ a: 'string', b: 'string', c: 'string', d: 'string' })).toBe(false);
  });

  it('Index Signature using enum', () => {
    enum Enumerable {
      a = 'a',
      b = 'b',
      c = 'c',
    }

    type Query = {
      [type in Enumerable]: string;
    };

    const objectSchema = schema<Query>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ a: 'string', b: 'string', c: 'string' })).toBe(true);

    expect(validate({ a: 'string', b: 'string', c: 'string', d: 'string' })).toBe(false);
  });

  it('Index Signature using enum and optional', () => {
    enum Enumerable {
      a = 'a',
      b = 'b',
      c = 'c',
    }

    type Query = {
      [type in Enumerable]?: string;
    };

    const objectSchema = schema<Query>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ a: 'string' })).toBe(true);
    expect(validate({ b: 'string' })).toBe(true);
    expect(validate({ c: 'string' })).toBe(true);
    expect(validate({ a: 'string', b: 'string', c: 'string' })).toBe(true);

    expect(validate({ d: 'string' })).toBe(false);
  });
});
