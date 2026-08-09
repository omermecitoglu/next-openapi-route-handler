import { type ZodType, z } from "zod";
import type { SchemaObject } from "@omer-x/json-schema-types";

export default function convertToOpenAPI(schema: ZodType<unknown>, isArray: boolean) {
  return z.toJSONSchema(isArray ? schema.array() : schema, {
    unrepresentable: "any",
    override: ctx => {
      if (ctx.zodSchema._zod.def.type === "date") {
        ctx.jsonSchema.type = "string";
        ctx.jsonSchema.format = "date-time";
      }
    },
  }) as SchemaObject;
}
