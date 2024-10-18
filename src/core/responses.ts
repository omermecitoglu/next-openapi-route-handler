import z from "zod";
import type { ResponseDefinition } from "~/types/response";
import { ZOD_ISSUE } from "~/zod/issue";
import { resolveContent } from "./content";
import convertToOpenAPI from "./zod-to-openapi";
import type { ResponseObject, ResponsesObject } from "@omer-x/openapi-types/response";

export function addBadRequest(queryParams?: unknown, requestBody?: unknown) {
  if (!queryParams && !requestBody) return undefined;
  return {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: convertToOpenAPI(z.object({
          success: z.boolean(),
          errorType: z.enum([
            "PARSE_FORM_DATA_ERROR",
            "PARSE_REQUEST_BODY_ERROR",
            "PARSE_SEARCH_PARAMS_ERROR",
          ]),
          zodIssues: ZOD_ISSUE.array(),
        }), false),
      },
    },
  } as ResponseObject;
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
