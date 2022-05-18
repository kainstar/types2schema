import { schema } from '../../';
import { createEmptySchema } from '../utils/validate';

describe('Any Value Tests', () => {
  it('any', () => {
    expect(schema<any>()).toStrictEqual(createEmptySchema());
  });
});
