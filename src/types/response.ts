import type { ZodType } from "zod";

export type ResponseDefinition = {
  description: string,
  content?: ZodType | string,
};
