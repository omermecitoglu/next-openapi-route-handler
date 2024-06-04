import type { HttpMethod } from "~/types/http";
import type { FixedRequest } from "~/types/request";
import { resolveContent } from "./content";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ZodType } from "zod";

export function resolveRequestBody(source?: ZodType<unknown> | string) {
  if (!source) return undefined;
  return {
    // description: "", // how to fill this?
    required: true,
    content: resolveContent(source),
  } as RequestBodyObject;
}

export async function parseRequestBody<B>(request: FixedRequest<B>, method: HttpMethod, schema?: ZodType<B> | string) {
  if (!schema || typeof schema === "string") return null;
  if (method === "GET") throw new Error("GET routes can't have request body");
  return schema.parse(await request.json());
}
