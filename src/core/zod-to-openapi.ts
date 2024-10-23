import { zodToJsonSchema } from "zod-to-json-schema";
import { isFile } from "~/utils/zod-schema";
import type { SchemaObject } from "@omer-x/openapi-types/schema";
import type { ZodObject, ZodType } from "zod";

export default function convertToOpenAPI(schema: ZodType<unknown>, isArray: boolean) {
  const result = zodToJsonSchema(isArray ? schema.array() : schema, {
    target: "openApi3",
    $refStrategy: "none",
  }) as SchemaObject;
  if (result.type === "object" && result.properties) {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    for (const [propName, prop] of Object.entries<ZodType>((schema as ZodObject<{}>).shape)) {
      if (isFile(prop)) {
        result.properties[propName] = {
          type: "string",
          format: "binary",
          description: prop.description,
          // contentEncoding: "base64", // swagger-ui-react doesn't support this
        };
      }
    }
  }
  return result;
}
