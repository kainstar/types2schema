import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Utility-Type tests', () => {
  it('Basic partial interface', () => {
    interface IPartial {
      str: string;
      num: number;
    }

    const objectSchema = schema<Partial<IPartial>>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({})).toBe(true);
    expect(validate({ num: 1 })).toBe(true);
    expect(validate({ str: 'string' })).toBe(true);
    expect(validate({ str: 'string', num: 1 })).toBe(true);
  });
});
