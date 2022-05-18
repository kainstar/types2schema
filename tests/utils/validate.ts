import Ajv from 'ajv';

export const ajvInstance = new Ajv({
  strict: true,
  coerceTypes: false,
  removeAdditional: false,
  allErrors: false,
});

export function createEmptySchema() {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {},
  };
}
