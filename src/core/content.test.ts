import { describe, expect, it } from "vitest";
import { z } from "zod";
import { resolveContent } from "./content";
import type { RequestBodyObject } from "@omer-x/openapi-types/request-body";

describe("resolveContent", () => {
  it("should return undefined if source is not provided", () => {
    const result = resolveContent(undefined);
    expect(result).toBeUndefined();
  });

  it("should create content for a string schema reference", () => {
    const result = resolveContent("User", false);

    const expectedContent = {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/User",
        },
      },
    } as RequestBodyObject["content"];

    expect(result).toEqual(expectedContent);
  });

  it("should create content for a Zod schema", () => {
    const zodSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const result = resolveContent(zodSchema, false);

    const expectedContent = {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            age: {
              type: "number",
            },
          },
          required: ["name", "age"],
          additionalProperties: false,
          // @ts-expect-error: @omer-x/openapi-types doesn't have this
          $schema: "https://json-schema.org/draft/2020-12/schema",
        },
      },
    } satisfies RequestBodyObject["content"];

    expect(result).toEqual(expectedContent);
  });

  it("should create multipart/form-data content when isFormData is true", () => {
    const result = resolveContent("User", false, true);

    const expectedContent = {
      "multipart/form-data": {
        schema: {
          $ref: "#/components/schemas/User",
        },
      },
    } satisfies RequestBodyObject["content"];

    expect(result).toEqual(expectedContent);
  });
});
