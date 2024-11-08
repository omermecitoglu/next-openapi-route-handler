import { createSchemaRef } from "~/utils/openapi-components";
import convertToOpenAPI from "./zod-to-openapi";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ZodType } from "zod";

export function resolveContent(source?: ZodType<unknown> | string, isArray: boolean = false, isFormData: boolean = false) {
  if (!source) return undefined;

  const schema = typeof source === "string" ? createSchemaRef(source, isArray) : convertToOpenAPI(source, isArray);

  return {
    [isFormData ? "multipart/form-data" : "application/json"]: {
      schema,
    },
  } as RequestBodyObject["content"];
}
