import { safeParse } from "./zod-error-handler";
import type { ZodType } from "zod";

function serializeArray(value: string[]) {
  return value.join(",");
}

export function deserializeArray(value: string) {
  return value.split(",");
}

export default function parseSearchParams<T>(source: URLSearchParams, schema?: ZodType<T>) {
  if (!schema) return null;
  const sourceKeys = Array.from(new Set(source.keys()));
  const params = sourceKeys.reduce((collection, key) => {
    const values = source.getAll(key);
    return {
      ...collection,
      [key]: serializeArray(values),
    };
  }, {});
  return safeParse(schema, params);
}
