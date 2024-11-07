import type { ExampleStrategy } from "~/types/example";
import generateExample from "~/utils/generateExample";
import type { ZodType } from "zod";

export function injectExample(strategy: ExampleStrategy, schema: ZodType<unknown> | string, isArray: boolean) {
  if (strategy === "none" || typeof schema === "string") return {};
  const isStrict = strategy === "strict-full" || strategy === "strict-ignore-optionals";
  const ignoreOptionals = strategy === "ignore-optional" || strategy === "strict-ignore-optionals";
  return {
    example: generateExample(isArray ? schema.array() : schema, ignoreOptionals, isStrict),
  };
}
