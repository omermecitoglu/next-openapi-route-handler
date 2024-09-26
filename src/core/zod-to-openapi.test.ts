import { describe, expect, it } from "@jest/globals";
import z from "zod";
import convertToOpenAPI from "./zod-to-openapi";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

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
    };

    expect(openAPISchema).toEqual(expectedSchema);
  });

  it("should convert an array Zod schema to OpenAPI schema", () => {
    const zodSchema = z.string();

    const openAPISchema = convertToOpenAPI(zodSchema, true);

    const expectedSchema: SchemaObject = {
      type: "array",
      items: { type: "string" },
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
    };

    expect(openAPISchema).toEqual(expectedSchema);
  });

  it("should handle file type correctly in an object", () => {
    const zodSchema = z.object({
      file: z.instanceof(File),
    });

    const openAPISchema = convertToOpenAPI(zodSchema, false);

    const expectedSchema: SchemaObject = {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
      required: ["file"],
      additionalProperties: false,
    };

    expect(openAPISchema).toEqual(expectedSchema);
  });
});
