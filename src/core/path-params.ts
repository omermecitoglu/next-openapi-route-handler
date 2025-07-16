import { safeParse } from "./zod-error-handler";
import type { ZodError, ZodType } from "zod";

export default function parsePathParams<I, O>(source?: I, schema?: ZodType<O, I>) {
  if (!schema) return null;
  if (!source) throw new Error("UNNECESSARY_PATH_PARAMS");
  try {
    return safeParse(schema, source as Record<string, unknown>);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log((error as ZodError).issues);
    }
    throw new Error("PARSE_PATH_PARAMS", { cause: (error as ZodError).issues });
  }
}
