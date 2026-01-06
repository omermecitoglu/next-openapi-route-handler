import { describe, expect, it } from "vitest";
import createMediaType from "./createMediaType";
import type { SchemaObject } from "@omer-x/json-schema-types";

describe("createMediaType", () => {
  const mockSchema: SchemaObject = { type: "string" };
  const mockExample = "example text";
  const mockExamples = {
    "Example-1": {
      value: "Example 1",
      description: "1st Example",
    },
    "Example-2": {
      value: "Example 2",
      description: "2nd Example",
    },
    "Example-3": {
      value: "Example 3",
      description: "3rd Example",
    },
  };

  it("should create a MediaTypeObject with only the schema", () => {
    expect(createMediaType(mockSchema)).toStrictEqual({
      schema: mockSchema,
    });
  });

  it("should create a MediaTypeObject with schema and example when example is provided", () => {
    expect(createMediaType(mockSchema, mockExample)).toStrictEqual({
      schema: mockSchema,
      example: mockExample,
    });
  });

  it("should create a MediaTypeObject with schema and examples when examples are provided", () => {
    expect(createMediaType(mockSchema, undefined, mockExamples)).toStrictEqual({
      schema: mockSchema,
      examples: {
        "Example-1": {
          value: "Example 1",
          description: "1st Example",
        },
        "Example-2": {
          value: "Example 2",
          description: "2nd Example",
        },
        "Example-3": {
          value: "Example 3",
          description: "3rd Example",
        },
      },
    });
  });
});
