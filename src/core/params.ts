import type { ExampleStrategy } from "~/types/example";
import { injectExample } from "./example";
import convertToOpenAPI from "./zod-to-openapi";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";
import type { ZodType } from "zod";

export function resolveParams(kind: ParameterObject["in"], exampleStrategy: ExampleStrategy, source?: ZodType<unknown>) {
  if (!source) return [];
  const schema = convertToOpenAPI(source, false);
  if (!("properties" in schema)) throw new Error("Invalid object schema");
  const entries = Object.entries(schema.properties ?? {});
  return entries.map<ParameterObject>(([name, definition]) => ({
    in: kind,
    name: name,
    required: schema.required?.includes(name) ?? false,
    description: definition.description,
    schema: definition,
    ...injectExample(exampleStrategy, source, false),
  }));
}
