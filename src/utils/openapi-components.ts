import type { SchemaObject } from "@omer-x/openapi-types/schema";

export function createSchemaRef(schemaName: string, isArray: boolean) {
  const refObject = { $ref: `#/components/schemas/${schemaName}` } as SchemaObject;
  if (isArray) {
    return { type: "array", items: refObject } as SchemaObject;
  }
  return refObject;
}
