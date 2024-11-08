import { describe, expect, it } from "@jest/globals";
import createMediaType from "./createMediaType";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("createMediaType", () => {
  const mockSchema: SchemaObject = { type: "string" };
  const mockExample = "example text";

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
});
