import zodToJsonSchema from "zod-to-json-schema";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { SchemaObject } from "@omer-x/openapi-types/schema";
import type { ZodType } from "zod";

export function resolveParams(kind: ParameterObject["in"], source?: ZodType<unknown>) {
  if (!source) return [];
  const collection: ParameterObject[] = [];
  const schema = zodToJsonSchema(source) as SchemaObject<"object">;
  for (const [name, definition] of Object.entries(schema.properties)) {
    collection.push({
      in: kind,
      name: name,
      required: schema.required?.includes(name) ?? false,
      description: definition.description,
      schema: definition,
    });
  }
  return collection;
}
