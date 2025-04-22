import type { ResponseCollection, ResponseDefinition } from "~/types/response";
import { resolveContent } from "./content";
import type { ResponseObject, ResponsesObject } from "@omer-x/openapi-types/response";

export function addBadRequest(queryParams?: unknown, requestBody?: unknown) {
  if (!queryParams && !requestBody) return undefined;
  return { description: "Bad Request" } as ResponseObject;
}

export function bundleResponses<Defs extends Record<string, unknown>>(collection: ResponseCollection<Defs>) {
  return Object.entries(collection).reduce((result, [key, response]: [string, ResponseDefinition<unknown>]) => {
    if (response.content) {
      return {
        ...result,
        [key]: {
          description: response.description,
          content: resolveContent(response.content, response.isArray, false, response.example, response.examples),
        } satisfies ResponseObject,
      };
    }
    if (response.customContent) {
      return {
        ...result,
        [key]: {
          description: response.description,
          content: response.customContent,
        } satisfies ResponseObject,
      };
    }
    return result;
  }, {}) as ResponsesObject;
}
