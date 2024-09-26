import convertToOpenAPI from "./zod-to-openapi";
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
  return convertToOpenAPI(source, isArray);
}

export function resolveContent(source?: ZodType<unknown> | string, isArray: boolean = false, isFormData: boolean = false) {
  if (!source) return undefined;
  return {
    [isFormData ? "multipart/form-data" : "application/json"]: {
      schema: resolveSchema(source, isArray),
    },
  } as RequestBodyObject["content"];
}
