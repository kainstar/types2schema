import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Generic type tests', () => {
  it('Generic primitive type', () => {
    interface IGeneric<T> {
      generic: T;
    }

    const genericSchema = schema<IGeneric<string>>();
    const validate = ajvInstance.compile(genericSchema);

    expect(validate({ generic: 'string' })).toBe(true);

    expect(validate({ generic: 1 })).toBe(false);
  });

  it('Generic union type', () => {
    interface IGeneric<T> {
      generic: T;
    }

    const genericSchema = schema<IGeneric<string | number>>();
    const validate = ajvInstance.compile(genericSchema);

    expect(validate({ generic: 'string' })).toBe(true);
    expect(validate({ generic: 1 })).toBe(true);

    expect(validate({ generic: true })).toBe(false);
  });

  it('Generic interface type', () => {
    interface IBase {
      str: string;
    }

    interface IGeneric<T> {
      generic: T;
    }

    const genericSchema = schema<IGeneric<IBase>>();
    const validate = ajvInstance.compile(genericSchema);

    expect(validate({ generic: { str: 'string' } })).toBe(true);

    expect(validate({ generic: 'string' })).toBe(false);
    expect(validate({ generic: {} })).toBe(false);
  });

  it('Generic default value', () => {
    interface IGeneric<F = null> {
      generic: F;
    }

    const genericSchema = schema<IGeneric>();
    const validate = ajvInstance.compile(genericSchema);

    expect(validate({ generic: null })).toBe(true);

    expect(validate({ generic: 'string' })).toBe(false);
  });
});
