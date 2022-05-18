import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Optional type tests', () => {
  it('Interface with optional string', () => {
    interface IOptional {
      str?: string;
    }

    const objectSchema = schema<IOptional>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({})).toBe(true);
    expect(validate({ str: 'string' })).toBe(true);
  });

  it('Interface with all optional', () => {
    interface IOptional {
      limit?: number;
      offset?: number;
    }

    const objectSchema = schema<IOptional>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({})).toBe(true);
    expect(validate({ limit: 5 })).toBe(true);
    expect(validate({ offset: 10 })).toBe(true);
    expect(validate({ limit: 5, offset: 10 })).toBe(true);
  });

  it('Interface with some optional', () => {
    interface IOptional {
      limit?: number;
      offset?: number;
      x: number;
    }

    const objectSchema = schema<IOptional>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ x: 1 })).toBe(true);
    expect(validate({ x: 1, limit: 5 })).toBe(true);
    expect(validate({ x: 1, offset: 10 })).toBe(true);
    expect(validate({ x: 1, limit: 5, offset: 10 })).toBe(true);

    expect(validate({})).toBe(false);
    expect(validate({ limit: 5 })).toBe(false);
    expect(validate({ offset: 10 })).toBe(false);
    expect(validate({ limit: 5, offset: 10 })).toBe(false);
  });

  it('Property is union which has undefined is optional', () => {
    interface IOptional {
      str: string | undefined;
    }

    const objectSchema = schema<IOptional>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({})).toBe(true);
    expect(validate({ str: 'string' })).toBe(true);
  });
});
