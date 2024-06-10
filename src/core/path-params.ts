import { safeParse } from "./zod-error-handler";
import type { ZodType } from "zod";

export default function parsePathParams<T>(source?: T, schema?: ZodType<T>) {
  if (!schema || !source) return null;
  return safeParse(schema, source as Record<string, unknown>);
}
