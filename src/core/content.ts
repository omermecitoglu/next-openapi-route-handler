import { createSchemaRef } from "~/utils/openapi-components";
import createMediaType from "./createMediaType";
import convertToOpenAPI from "./zod-to-openapi";
import type { ExampleObject } from "@omer-x/openapi-types/example";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ZodType, ZodTypeDef } from "zod";

export function resolveContent<I, O>(
  source?: ZodType<O, ZodTypeDef, I> | string,
  isArray: boolean = false,
  isFormData: boolean = false,
  customExample?: NoInfer<O>,
  customExamples?: Record<string, ExampleObject<NoInfer<O>>>,
) {
  if (!source) return undefined;

  const schema = typeof source === "string" ? createSchemaRef(source, isArray) : convertToOpenAPI(source, isArray);

  return {
    [isFormData ? "multipart/form-data" : "application/json"]: createMediaType(schema, customExample, customExamples),
  } as RequestBodyObject["content"];
}
