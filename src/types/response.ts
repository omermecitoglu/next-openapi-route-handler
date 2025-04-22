import type { ExampleObject } from "@omer-x/openapi-types/example";
import type { MediaTypeObject } from "@omer-x/openapi-types/media-type";
import type { ZodType, ZodTypeDef } from "zod";

export type ResponseDefinition<O, I = O> = {
  description: string,
  isArray?: boolean,
  example?: NoInfer<O>,
  examples?: Record<string, ExampleObject<NoInfer<O>>>,
} & ({
  content?: ZodType<O, ZodTypeDef, I> | string,
  customContent?: never,
} | {
  content?: never,
  customContent?: Record<string, MediaTypeObject>,
});

export type ResponseCollection<T extends Record<string, unknown>> = {
  [K in keyof T]: ResponseDefinition<T[K]>;
};
