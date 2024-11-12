import type { ExampleObject } from "@omer-x/openapi-types/example";
import type { ZodType, ZodTypeDef } from "zod";

export type ResponseDefinition<O, I = O> = {
  description: string,
  isArray?: boolean,
  content?: ZodType<O, ZodTypeDef, I> | string,
  example?: NoInfer<O>,
  examples?: Record<string, ExampleObject<NoInfer<O>>>,
};

export type ResponseCollection<T extends Record<string, unknown>> = {
  [K in keyof T]: ResponseDefinition<T[K]>;
};
