import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Tuple type tests', () => {
  it('One Element', () => {
    type Tuple = [string];
    const tupleSchema = schema<Tuple>();
    const validate = ajvInstance.compile(tupleSchema);

    expect(validate(['string'])).toBe(true);

    expect(validate(['string', 'string'])).toBe(false);
    expect(validate([1])).toBe(false);
  });

  it('Two or More Element', () => {
    type Tuple = [string, number];
    const tupleSchema = schema<Tuple>();
    const validate = ajvInstance.compile(tupleSchema);

    expect(validate(['string', 1])).toBe(true);

    expect(validate([1])).toBe(false);
    expect(validate(['string'])).toBe(false);
    expect(validate(['string', 1, true])).toBe(false);
  });

  it('Optional Element', () => {
    type Tuple = [string, number?];
    const tupleSchema = schema<Tuple>();
    const validate = ajvInstance.compile(tupleSchema);

    expect(validate(['string'])).toBe(true);
    expect(validate(['string', 1])).toBe(true);
  });

  it('Rest Element', () => {
    type Tuple = [string, ...number[]];
    const tupleSchema = schema<Tuple>();
    const validate = ajvInstance.compile(tupleSchema);

    expect(validate(['string'])).toBe(true);
    expect(validate(['string', 1, 2, 3])).toBe(true);

    expect(validate(['string', 'string', 1, 2, 3])).toBe(false);
    expect(validate(['string', 1, 2, 3, 'string'])).toBe(false);
  });

  it('Flatten Rest Element', () => {
    type Tuple = [string, ...[number, string]];
    const tupleSchema = schema<Tuple>();
    const validate = ajvInstance.compile(tupleSchema);

    expect(validate(['string', 1, 'string'])).toBe(true);
  });
});
