import { safeParse } from "./zod-error-handler";
import type { ZodError, ZodType } from "zod";

export default function parsePathParams<T>(source?: T, schema?: ZodType<T>) {
  if (!schema || !source) return null;
  try {
    return safeParse(schema, source as Record<string, unknown>);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log((error as ZodError).issues);
    }
    throw new Error("PARSE_PATH_PARAMS");
  }
}
