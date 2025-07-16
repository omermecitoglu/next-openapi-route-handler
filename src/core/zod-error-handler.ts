import { convertStringToArray, convertStringToBoolean, convertStringToNumber } from "~/utils/type-conversion";
import type { ZodType } from "zod";

export function safeParse<I, O>(schema: ZodType<O, I>, input: Record<string, unknown>) {
  const result = schema.safeParse(input);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const [key] = issue.path;
      if (issue.code === "invalid_type" && typeof key === "string" && key in input && typeof input[key] === "string") {
        if (issue.expected === "number") {
          return safeParse(schema, convertStringToNumber(input, issue.path as string[]));
        }
        if (issue.expected === "boolean") {
          return safeParse(schema, convertStringToBoolean(input, issue.path as string[]));
        }
        if (issue.expected === "array") {
          return safeParse(schema, convertStringToArray(input, issue.path as string[]));
        }
      }
    }
    throw result.error;
  }
  return result.data;
}
