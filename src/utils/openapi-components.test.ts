import { describe, expect, it } from "vitest";
import { createSchemaRef } from "./openapi-components";
import type { SchemaObject } from "@omer-x/json-schema-types";

describe("createSchemaRef", () => {
  it("should create a schema reference for a single schema", () => {
    const result = createSchemaRef("User", false);

    const expected: SchemaObject = {
      $ref: "#/components/schemas/User",
    };

    expect(result).toEqual(expected);
  });

  it("should create a schema reference for an array of schemas", () => {
    const result = createSchemaRef("User", true);

    const expected: SchemaObject = {
      type: "array",
      items: {
        $ref: "#/components/schemas/User",
      },
    };

    expect(result).toEqual(expected);
  });
});
