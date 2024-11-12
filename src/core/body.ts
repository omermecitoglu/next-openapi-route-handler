import type { HttpMethod } from "~/types/http";
import type { FixedRequest } from "~/types/request";
import { resolveContent } from "./content";
import { safeParse } from "./zod-error-handler";
import type { ExampleObject } from "@omer-x/openapi-types/example";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ZodError, ZodType, ZodTypeDef } from "zod";

export function resolveRequestBody<I, O>(
  source?: ZodType<O, ZodTypeDef, I> | string,
  isFormData: boolean = false,
  customExample?: NoInfer<O>,
  customExamples?: Record<string, ExampleObject<NoInfer<O>>>,
) {
  if (!source) return undefined;
  return {
    // description: "", // how to fill this?
    required: true,
    content: resolveContent(source, false, isFormData, customExample, customExamples),
  } as RequestBodyObject;
}

export async function parseRequestBody<I, O>(
  request: FixedRequest<NoInfer<I>>,
  method: HttpMethod,
  schema?: ZodType<O, ZodTypeDef, I> | string,
  isFormData: boolean = false,
): Promise<O | null> {
  if (!schema || typeof schema === "string") return null;
  if (method === "GET") throw new Error("GET routes can't have request body");
  if (isFormData) {
    const formData = await request.formData();
    const body = Array.from(formData.keys()).reduce((collection, key) => ({
      ...collection, [key]: formData.get(key),
    }), {});
    try {
      return safeParse(schema, body);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log((error as ZodError).issues);
      }
      throw new Error("PARSE_FORM_DATA", { cause: (error as ZodError).issues });
    }
  }
  try {
    return schema.parse(await request.json());
  } catch (error) {
    if (error instanceof Error && error.message === "Unexpected end of JSON input") {
      const result = schema.safeParse({});
      throw new Error("PARSE_REQUEST_BODY", { cause: result.error?.issues });
    }
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log((error as ZodError).issues);
    }
    throw new Error("PARSE_REQUEST_BODY", { cause: (error as ZodError).issues });
  }
}
