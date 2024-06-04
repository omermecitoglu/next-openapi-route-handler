import type { ZodType } from "zod";

export default function parseSearchParams<T>(source: URLSearchParams, schema?: ZodType<T>) {
  if (!schema) return null;
  const params = Array.from(source).reduce((collection, [key, value]) => ({
    ...collection,
    [key]: value,
  }), {});
  return schema.parse(params);
}
