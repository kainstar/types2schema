import Ajv from 'ajv';

import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Enum types test', () => {
  it('String Enum', () => {
    enum UserGroup {
      Admin = 'admin',
      Manager = 'manager',
      Employee = 'employee',
    }

    const enumSchema = schema<UserGroup>();
    const validate = ajvInstance.compile(enumSchema);

    expect(validate(UserGroup.Admin)).toBe(true);
    expect(validate(UserGroup.Manager)).toBe(true);
    expect(validate(UserGroup.Employee)).toBe(true);

    expect(validate('other')).toBe(false);
  });

  it('Default number Enum', () => {
    enum UserGroup {
      Admin,
      Manager,
      Employee,
    }

    const enumSchema = schema<UserGroup>();
    const validate = ajvInstance.compile(enumSchema);

    expect(validate(UserGroup.Admin)).toBe(true);
    expect(validate(UserGroup.Manager)).toBe(true);
    expect(validate(UserGroup.Employee)).toBe(true);

    expect(validate(4)).toBe(false);
  });

  it('Mixed enumerable', () => {
    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }

    const enumSchema = schema<UserGroup>();
    const validate = ajvInstance.compile(enumSchema);

    expect(validate(UserGroup.Admin)).toBe(true);
    expect(validate(UserGroup.Manager)).toBe(true);
    expect(validate(UserGroup.Employee)).toBe(true);

    expect(validate(4)).toBe(false);
    expect(validate('other')).toBe(false);
  });

  it('Interface with enum property', () => {
    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }

    interface IEnumerable {
      enum: UserGroup;
    }

    const enumSchema = schema<IEnumerable>();
    const validate = ajvInstance.compile(enumSchema);

    expect(validate({ enum: UserGroup.Admin })).toBe(true);
    expect(validate({ enum: UserGroup.Manager })).toBe(true);
    expect(validate({ enum: UserGroup.Employee })).toBe(true);

    expect(validate({ enum: 4 })).toBe(false);
    expect(validate({ enum: 'other' })).toBe(false);
  });

  it('Interface with optional enum property', () => {
    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }

    interface IEnumerable {
      enum?: UserGroup;
    }

    const enumSchema = schema<IEnumerable>();
    const validate = ajvInstance.compile(enumSchema);

    expect(validate({})).toBe(true);
    expect(validate({ enum: UserGroup.Admin })).toBe(true);
    expect(validate({ enum: UserGroup.Manager })).toBe(true);
    expect(validate({ enum: UserGroup.Employee })).toBe(true);

    expect(validate({ enum: 4 })).toBe(false);
    expect(validate({ enum: 'other' })).toBe(false);
  });

  it('Interface with partial enum value property', () => {
    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }

    interface IEnumerable {
      enum: UserGroup.Admin | UserGroup.Employee;
    }

    const enumSchema = schema<IEnumerable>();
    const validate = ajvInstance.compile(enumSchema);

    expect(validate({ enum: UserGroup.Admin })).toBe(true);
    expect(validate({ enum: UserGroup.Employee })).toBe(true);

    expect(validate({})).toBe(false);
    expect(validate({ enum: UserGroup.Manager })).toBe(false);
    expect(validate({ enum: 4 })).toBe(false);
    expect(validate({ enum: 'other' })).toBe(false);
  });

  it('Interface with optional partial enum value property', () => {
    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }

    interface IEnumerable {
      enum?: UserGroup.Admin | UserGroup.Employee;
    }

    const enumSchema = schema<IEnumerable>();
    const validate = ajvInstance.compile(enumSchema);

    expect(validate({ enum: UserGroup.Admin })).toBe(true);
    expect(validate({ enum: UserGroup.Employee })).toBe(true);

    expect(validate({ enum: UserGroup.Manager })).toBe(false);
    expect(validate({ enum: 4 })).toBe(false);
    expect(validate({ enum: 'other' })).toBe(false);
  });

  it('ajv will coerce types correctly', () => {
    const coerceTypesAjvInstance = new Ajv({
      coerceTypes: true,
    });

    enum UserGroup {
      Admin = 1,
      Manager = 2,
      Employee = 'employee',
    }
    const enumSchema = schema<UserGroup>();
    const validate = coerceTypesAjvInstance.compile(enumSchema);

    expect(validate('1')).toBe(true);
    expect(validate(1)).toBe(true);
    expect(validate('2')).toBe(true);
    expect(validate(2)).toBe(true);
    expect(validate('employee')).toBe(true);

    expect(validate(3)).toBe(false);
  });
});
