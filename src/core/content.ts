import type { ExampleStrategy } from "~/types/example";
import { createSchemaRef } from "~/utils/openapi-components";
import { injectExample } from "./example";
import convertToOpenAPI from "./zod-to-openapi";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ZodType } from "zod";

export function resolveContent(exampleStrategy: ExampleStrategy, source?: ZodType<unknown> | string, isArray: boolean = false, isFormData: boolean = false) {
  if (!source) return undefined;

  const schema = typeof source === "string" ? createSchemaRef(source, isArray) : convertToOpenAPI(source, isArray);

  return {
    [isFormData ? "multipart/form-data" : "application/json"]: {
      schema,
      ...injectExample(exampleStrategy, source, isArray),
    },
  } as RequestBodyObject["content"];
}
