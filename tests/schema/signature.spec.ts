import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Index interface', () => {
  it('String signature interface', () => {
    interface IStringIndex {
      [key: string]: string;
    }

    const objectSchema = schema<IStringIndex>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ key1: 'value1', key2: 'value2' })).toBe(true);

    expect(validate({ key1: 1 })).toBe(false);
    expect(validate({ key1: true })).toBe(false);
  });

  it('Index interface nested', () => {
    interface INestedIndex {
      index: {
        [group: number]: string[];
      };
    }

    const objectSchema = schema<INestedIndex>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ index: { key: ['value'] } })).toBe(true);

    expect(validate({ index: { key: 'value' } })).toBe(false);
    expect(validate({ unIndex: { key: 'value' } })).toBe(false);
  });
});
