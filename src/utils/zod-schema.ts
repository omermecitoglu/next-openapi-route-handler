import type { ZodType } from "zod";

export function isFile(schema: ZodType<unknown>) {
  const result = schema.safeParse(new File([], "nothing.txt"));
  return result.success;
}
