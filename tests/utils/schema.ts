import { JSONSchema7 } from 'json-schema';

function getDefinitionKey(ref: string) {
  return ref.replace('#/definitions/', '');
}

export function findDefinitionByRef(schema: JSONSchema7, ref?: string) {
  if (!ref) {
    return null;
  }
  return schema.definitions?.[getDefinitionKey(ref)] as JSONSchema7;
}

export function findDefinitionByProperty(
  rootSchema: JSONSchema7,
  currentDefinition: JSONSchema7 | null,
  propertyName: string
) {
  const property = currentDefinition?.properties?.[propertyName] as JSONSchema7;
  if (property.$ref) {
    return findDefinitionByRef(rootSchema, property.$ref);
  }
  return property;
}

export function findRootDefinition(schema: JSONSchema7) {
  const rootRef = schema.$ref;
  return findDefinitionByRef(schema, rootRef);
}
