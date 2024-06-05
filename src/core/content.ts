import zodToJsonSchema from "zod-to-json-schema";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { SchemaObject } from "@omer-x/openapi-types/schema";
import type { ZodType } from "zod";

function resolveSchema(source: ZodType<unknown> | string, isArray: boolean = false): SchemaObject {
  if (typeof source === "string") {
    const refObject = { $ref: `#/components/schemas/${source}` } as SchemaObject;
    if (isArray) {
      return { type: "array", items: refObject } as SchemaObject;
    }
    return refObject;
  }
  return zodToJsonSchema(isArray ? source.array() : source, { target: "openApi3" }) as SchemaObject;
}

export function resolveContent(source?: ZodType<unknown> | string, isArray: boolean = false) {
  if (!source) return undefined;
  return {
    "application/json": {
      schema: resolveSchema(source, isArray),
    },
  } as RequestBodyObject["content"];
}
