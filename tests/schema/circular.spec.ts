import { schema } from '../../';
import { findDefinitionByProperty, findRootDefinition } from '../utils/schema';

describe('Circular Reference Tests', () => {
  it('Self circular reference', () => {
    interface ICircular {
      a: string;
      b: ICircular;
    }

    const circularSchema = schema<ICircular>();

    const rootDefinition = findRootDefinition(circularSchema);
    const propertyBDefinition = findDefinitionByProperty(circularSchema, rootDefinition, 'b');
    expect(rootDefinition === propertyBDefinition).toBe(true);
  });

  it('Recursion with 2 interfaces', () => {
    interface IStep1 {
      step2: IStep2;
    }

    interface IStep2 {
      step1: IStep1;
    }

    const circularSchema = schema<IStep1>();
    const rootDefinition = findRootDefinition(circularSchema);
    const step2Definition = findDefinitionByProperty(circularSchema, rootDefinition, 'step2');
    const step1Definition = findDefinitionByProperty(circularSchema, step2Definition, 'step1');

    expect(rootDefinition).not.toBeNull();
    expect(rootDefinition).not.toBeUndefined();
    expect(step1Definition).not.toBeUndefined();
    expect(step1Definition).not.toBeUndefined();
    expect(rootDefinition === step1Definition).toBe(true);
  });
});
