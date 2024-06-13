import type { HttpMethod } from "~/types/http";
import type { FixedRequest } from "~/types/request";
import { resolveContent } from "./content";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ZodError, ZodType } from "zod";

export function resolveRequestBody(source?: ZodType<unknown> | string, isFormData: boolean = false) {
  if (!source) return undefined;
  return {
    // description: "", // how to fill this?
    required: true,
    content: resolveContent(source, false, isFormData),
  } as RequestBodyObject;
}

export async function parseRequestBody<B>(
  request: FixedRequest<B>,
  method: HttpMethod,
  schema?: ZodType<B> | string,
  isFormData: boolean = false
) {
  if (!schema || typeof schema === "string") return null;
  if (method === "GET") throw new Error("GET routes can't have request body");
  if (isFormData) {
    const formData = await request.formData();
    const body = Array.from(formData.keys()).reduce((collection, key) => ({
      ...collection, [key]: formData.get(key),
    }), {});
    try {
      return schema.parse(body);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log((error as ZodError).issues);
      }
      throw new Error("PARSE_FORM_DATA");
    }
  }
  try {
    return schema.parse(await request.json());
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log((error as ZodError).issues);
    }
    throw new Error("PARSE_REQUEST_BODY");
  }
}
