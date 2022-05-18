import { schema } from '../../';
import { ajvInstance } from '../utils/validate';

describe('Empty Value Tests', () => {
  it('Empty interface', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IEmpty {}

    const emptySchema = schema<IEmpty>();
    const validate = ajvInstance.compile(emptySchema);

    expect(validate({})).toBe(true);

    expect(validate('primitive')).toBe(false);
    expect(validate({ key: 'value' })).toBe(false);
  });

  it('Empty type', () => {
    type IEmpty = {};

    const emptySchema = schema<IEmpty>();
    const validate = ajvInstance.compile(emptySchema);

    expect(validate({})).toBe(true);

    expect(validate('primitive')).toBe(false);
    expect(validate({ key: 'value' })).toBe(false);
  });
});
