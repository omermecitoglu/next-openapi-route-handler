import { describe, expect, it } from "vitest";
import z from "zod";
import convertToOpenAPI from "./zod-to-openapi";
import type { SchemaObject } from "@omer-x/json-schema-types";

describe("convertToOpenAPI", () => {
  it("should convert a simple Zod schema to OpenAPI schema", () => {
    const zodSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const openAPISchema = convertToOpenAPI(zodSchema, false);

    const expectedSchema: SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
      additionalProperties: false,
      $schema: "https://json-schema.org/draft/2020-12/schema",
    };

    expect(openAPISchema).toEqual(expectedSchema);
  });

  it("should convert an array Zod schema to OpenAPI schema", () => {
    const zodSchema = z.string();

    const openAPISchema = convertToOpenAPI(zodSchema, true);

    const expectedSchema: SchemaObject = {
      type: "array",
      items: { type: "string" },
      $schema: "https://json-schema.org/draft/2020-12/schema",
    };

    expect(openAPISchema).toEqual(expectedSchema);
  });

  it("should convert Zod schema with nested objects to OpenAPI schema", () => {
    const zodSchema = z.object({
      user: z.object({
        id: z.string(),
        isActive: z.boolean(),
      }),
    });

    const openAPISchema = convertToOpenAPI(zodSchema, false);

    const expectedSchema: SchemaObject = {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            isActive: { type: "boolean" },
          },
          required: ["id", "isActive"],
          additionalProperties: false,
        },
      },
      required: ["user"],
      additionalProperties: false,
      $schema: "https://json-schema.org/draft/2020-12/schema",
    };

    expect(openAPISchema).toEqual(expectedSchema);
  });

  it("should handle file type correctly in an object", () => {
    const zodSchema = z.object({
      file: z.file(),
    });

    const openAPISchema = convertToOpenAPI(zodSchema, false);

    const expectedSchema: SchemaObject = {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          contentEncoding: "binary" as unknown as undefined,
        },
      },
      required: ["file"],
      additionalProperties: false,
      $schema: "https://json-schema.org/draft/2020-12/schema",
    };

    expect(openAPISchema).toEqual(expectedSchema);
  });
});
