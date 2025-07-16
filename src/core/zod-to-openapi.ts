import { type ZodType, z } from "zod";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export default function convertToOpenAPI(schema: ZodType<unknown>, isArray: boolean) {
  return z.toJSONSchema(isArray ? schema.array() : schema) as SchemaObject;
}
