import convertToOpenAPI from "./zod-to-openapi";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { ZodType } from "zod";

export function resolveParams(kind: ParameterObject["in"], source?: ZodType<unknown>) {
  if (!source) return [];
  const collection: ParameterObject[] = [];
  const schema = convertToOpenAPI(source, false);
  if (!("properties" in schema)) throw new Error("Invalid object schema");
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
