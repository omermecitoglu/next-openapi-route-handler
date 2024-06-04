import zodToJsonSchema from "zod-to-json-schema";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";
import type { ZodType } from "zod";

export function resolveContent(source?: ZodType<unknown> | string) {
  if (!source) return undefined;
  return {
    "application/json": {
      schema: typeof source === "string" ? {
        $ref: `#/components/schemas/${source}`,
      } : zodToJsonSchema(source, {
        target: "openApi3",
      }),
    },
  } as RequestBodyObject["content"];
}
