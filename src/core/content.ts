import zodToJsonSchema from "zod-to-json-schema";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { SchemaObject } from "@omer-x/openapi-types/schema";
import type { ZodObject, ZodType } from "zod";

function resolveSchema(source: ZodType<unknown> | string, isArray: boolean = false): SchemaObject {
  if (typeof source === "string") {
    const refObject = { $ref: `#/components/schemas/${source}` } as SchemaObject;
    if (isArray) {
      return { type: "array", items: refObject } as SchemaObject;
    }
    return refObject;
  }
  const schema = zodToJsonSchema(isArray ? source.array() : source, { target: "openApi3" }) as SchemaObject;
  if (schema.type === "object" && source.constructor.name === "ZodObject") {
    // eslint-disable-next-line @typescript-eslint/ban-types
    for (const [propName, prop] of Object.entries((source as ZodObject<{}>).shape)) {
      const result = (prop as ZodType).safeParse(new File([], "nothing.txt"));
      if (result.success) {
        schema.properties[propName] = {
          type: "string",
          format: "binary",
          // contentEncoding: "base64", // swagger-ui-react doesn't support this
        };
      }
    }
  }
  return schema;
}

export function resolveContent(source?: ZodType<unknown> | string, isArray: boolean = false, isFormData: boolean = false) {
  if (!source) return undefined;
  return {
    [isFormData ? "multipart/form-data" : "application/json"]: {
      schema: resolveSchema(source, isArray),
    },
  } as RequestBodyObject["content"];
}
