import type { ResponseDefinition } from "~/types/response";
import { resolveContent } from "./content";
import type { ResponseObject, ResponsesObject } from "@omer-x/openapi-types/response";

export function addBadRequest(queryParams?: unknown, requestBody?: unknown) {
  if (!queryParams && !requestBody) return undefined;
  return { description: "Bad Request" } as ResponseObject;
}

export function bundleResponses(collection: Record<string, ResponseDefinition>) {
  return Object.entries(collection).reduce((result, [key, response]) => {
    return {
      ...result,
      [key]: {
        description: response.description,
        content: resolveContent(response.content, response.isArray),
      } satisfies ResponseObject,
    };
  }, {}) as ResponsesObject;
}
