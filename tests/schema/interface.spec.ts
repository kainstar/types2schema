import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Interface types tests', () => {
  it('Basic nested interfaces', () => {
    interface IInner {
      num: number;
      str: string;
    }

    interface IOuter {
      nested: IInner;
      num: number;
    }

    const objectSchema = schema<IOuter>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ num: 1, nested: { num: 2, str: 'string' } })).toBe(true);
  });
});
