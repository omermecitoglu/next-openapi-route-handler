import type { ResponseDefinition } from "~/types/response";
import { resolveContent } from "./content";
import type { ResponseObject, ResponsesObject } from "@omer-x/openapi-types/response";

export function addBadRequest(queryParams?: unknown, requestBody?: unknown) {
  if (queryParams || requestBody) {
    return { description: "Bad Request" } as ResponseObject;
  }
  return undefined;
}

export function bundleResponses(collection: Record<string, ResponseDefinition>) {
  return Object.keys(collection).reduce((result, key) => {
    const response = collection[key];
    return {
      ...result,
      [key]: !response ? undefined : {
        description: response.description,
        content: resolveContent(response.content, response.isArray),
      } satisfies ResponseObject,
    };
  }, {}) as ResponsesObject;
}
