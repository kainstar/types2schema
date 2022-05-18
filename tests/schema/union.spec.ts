import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Union type tests', () => {
  it('Union Literal', () => {
    type Unions = 1 | 'a';

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate(1)).toBe(true);
    expect(validate('a')).toBe(true);

    expect(validate(2)).toBe(false);
    expect(validate('string')).toBe(false);
  });

  it('Union with any', () => {
    type Unions = any | string;

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate(1)).toBe(true);
    expect(validate('string')).toBe(true);
    expect(validate(true)).toBe(true);
    expect(validate(null)).toBe(true);
    expect(validate({})).toBe(true);
  });

  it('Union string, number and boolean', () => {
    type Unions = string | number | boolean;

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate(1)).toBe(true);
    expect(validate('string')).toBe(true);
    expect(validate(true)).toBe(true);
    expect(validate(false)).toBe(true);

    expect(validate(null)).toBe(false);
    expect(validate({})).toBe(false);
  });

  it('Union primitive and literal', () => {
    type Unions = string | true;

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate('string')).toBe(true);
    expect(validate(true)).toBe(true);

    expect(validate(false)).toBe(false);
    expect(validate(1)).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate({})).toBe(false);
  });

  it('Union primitive and same type literal', () => {
    type Unions = string | 'string';

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate('string')).toBe(true);
    expect(validate('a')).toBe(true);

    expect(validate(true)).toBe(false);
    expect(validate(1)).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate({})).toBe(false);
  });

  it('Union enum and literal', () => {
    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }

    type Unions = UserGroup | 'a';

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate(UserGroup.Admin)).toBe(true);
    expect(validate(UserGroup.Manager)).toBe(true);
    expect(validate(UserGroup.Employee)).toBe(true);
    expect(validate('a')).toBe(true);

    expect(validate('b')).toBe(false);
    expect(validate(4)).toBe(false);
    expect(validate(true)).toBe(false);
    expect(validate(null)).toBe(false);
  });

  it('Union enum literal and other literal', () => {
    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }

    type Unions = UserGroup.Admin | UserGroup.Manager | boolean;

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate(UserGroup.Admin)).toBe(true);
    expect(validate(UserGroup.Manager)).toBe(true);
    expect(validate(true)).toBe(true);

    expect(validate(UserGroup.Employee)).toBe(false);
    expect(validate('a')).toBe(false);
    expect(validate(4)).toBe(false);
    expect(validate(null)).toBe(false);
  });

  it('Union in interface property ', () => {
    interface IUnion {
      union: string | number;
    }

    const unionSchema = schema<IUnion>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate({ union: 'string' })).toBe(true);
    expect(validate({ union: 1 })).toBe(true);

    expect(validate({ union: true })).toBe(false);
  });

  it('Union objects with literal', () => {
    type Unions = { variant: 'a'; a: number } | { variant: 1; b: number };

    const unionSchema = schema<Unions>();
    const validate = ajvInstance.compile(unionSchema);

    expect(validate({ variant: 'a', a: 1 })).toBe(true);
    expect(validate({ variant: 1, b: 1 })).toBe(true);

    expect(validate({ variant: 'a' })).toBe(false);
    expect(validate({ variant: 'a', b: 1 })).toBe(false);
    expect(validate({ variant: 1 })).toBe(false);
    expect(validate({ variant: 1, a: 1 })).toBe(false);
  });
});
