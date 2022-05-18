import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Intersection types tests', () => {
  it('Basic intersection', () => {
    interface IBase1 {
      part1: string;
    }

    interface IBase2 {
      part2: number;
    }

    const objectSchema = schema<IBase1 & IBase2>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ part1: 'string', part2: 1 })).toBe(true);

    expect(validate({ part1: 'string', part2: 1, part3: 'extra' })).toBe(false);
  });

  it('Intersection union and type', () => {
    type IIntersection = ({ a: number } | { b: string }) & { c: boolean };

    const objectSchema = schema<IIntersection>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ a: 1, c: true })).toBe(true);
    expect(validate({ b: 'string', c: true })).toBe(true);

    expect(validate({ a: 1 })).toBe(false);
    expect(validate({ b: 'string' })).toBe(false);
    expect(validate({ c: true })).toBe(false);
  });

  it('Intersection additional properties', () => {
    type IIntersection = {
      [key: string]: number;
      a: number;
    } & {
      b: string;
    };

    const objectSchema = schema<IIntersection>();
    const validate = ajvInstance.compile(objectSchema);

    expect(validate({ a: 1, b: 'string' })).toBe(true);
    expect(validate({ a: 1, b: 'string', c: 1 })).toBe(true);

    expect(validate({ a: 1, b: 'string', c: true })).toBe(false);
  });
});
