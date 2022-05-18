import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Array type tests', () => {
  it('Array of any', () => {
    const arraySchema = schema<any[]>();
    const validate = ajvInstance.compile(arraySchema);

    expect(validate([])).toBe(true);
    expect(validate([1, 'string', true])).toBe(true);

    expect(validate(1)).toBe(false);
    expect(validate('string')).toBe(false);
    expect(validate(true)).toBe(false);
  });

  it('Array of single type', () => {
    const arraySchema = schema<string[]>();
    const validate = ajvInstance.compile(arraySchema);

    expect(validate([])).toBe(true);
    expect(validate(['string'])).toBe(true);
    expect(validate(['string', 'string'])).toBe(true);

    expect(validate([1])).toBe(false);
    expect(validate(['string', 1])).toBe(false);
  });

  it('Array TypeReference defined', () => {
    const arraySchema = schema<string[]>();
    const validate = ajvInstance.compile(arraySchema);

    expect(validate([])).toBe(true);
    expect(validate(['string'])).toBe(true);
    expect(validate(['string', 'string'])).toBe(true);

    expect(validate([1])).toBe(false);
    expect(validate(['string', 1])).toBe(false);
  });

  it('Nested Array', () => {
    const arraySchema = schema<number[][]>();
    const validate = ajvInstance.compile(arraySchema);

    expect(validate([])).toBe(true);
    expect(validate([[1, 2], [3]])).toBe(true);

    expect(validate([1])).toBe(false);
    expect(validate([['string', 1]])).toBe(false);
  });
});
