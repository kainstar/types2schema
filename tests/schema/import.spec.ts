import { schema as aliasSchema } from '../../';
import { createEmptySchema } from '../utils/validate';

describe('Import', () => {
  it('Named Alias Import', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(aliasSchema<any>()).toStrictEqual(createEmptySchema());
  });
});
