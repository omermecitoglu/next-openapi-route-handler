import type { ZodType } from "zod";

export default function parsePathParams<T>(source: unknown, schema?: ZodType<T>) {
  if (!schema) return null;
  return schema.parse(source);
}
