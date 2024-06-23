import zodToJsonSchema from "zod-to-json-schema";
import type { SchemaObject } from "@omer-x/openapi-types/schema";
import type { ZodType } from "zod";

export default function convertToOpenAPI(schema: ZodType<unknown>, isArray: boolean) {
  const result = zodToJsonSchema(isArray ? schema.array() : schema, {
    target: "openApi3",
    $refStrategy: "none",
  });
  return result as SchemaObject;
}
