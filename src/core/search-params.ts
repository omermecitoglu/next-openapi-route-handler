import { serializeArray } from "~/utils/array-serialization";
import { safeParse } from "./zod-error-handler";
import type { ZodError, ZodType, ZodTypeDef } from "zod";

export default function parseSearchParams<I, O>(source: URLSearchParams, schema?: ZodType<O, ZodTypeDef, I>) {
  if (!schema) return null;
  const sourceKeys = Array.from(new Set(source.keys()));
  const params = sourceKeys.reduce((collection, key) => {
    const values = source.getAll(key);
    return {
      ...collection,
      [key]: serializeArray(values),
    };
  }, {});
  try {
    return safeParse(schema, params);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log((error as ZodError).issues);
    }
    throw new Error("PARSE_SEARCH_PARAMS");
  }
}
