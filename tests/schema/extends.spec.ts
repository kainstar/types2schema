import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Extended types test', () => {
  it('Interface extends interface', () => {
    interface IExtendable {
      num: number;
      str: string;
    }

    interface IExtended extends IExtendable {
      bool: boolean;
    }

    const objectSchema = schema<IExtended>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ num: 1, str: 'string', bool: true })).toBe(true);

    expect(validate({ num: 1, str: 'string' })).toBe(false);
    expect(validate({ bool: true })).toBe(false);
  });

  it('Interface extends interface and overrides field', () => {
    interface IExtendable {
      num: number;
      str: string | number;
    }

    interface IOverride extends IExtendable {
      str: string;
    }

    const objectSchema = schema<IOverride>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ num: 1, str: 'string' })).toBe(true);

    expect(validate({ num: 1, str: 2 })).toBe(false);
  });
});
