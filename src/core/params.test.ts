import { describe, expect, it } from "vitest";
import z from "zod";
import { resolveParams } from "./params";
import type { ParameterObject } from "@omer-x/openapi-types/parameter";

describe("resolveParams", () => {
  it("should return an empty array if source is not provided", () => {
    const result = resolveParams("query", undefined);
    expect(result).toEqual([]);
  });

  it("should throw an error if the schema does not have properties", () => {
    const zodSchema = z.string();

    expect(() => resolveParams("query", zodSchema)).toThrow("Invalid object schema");
  });

  it("should resolve parameters for a valid Zod object schema", () => {
    const zodSchema = z.object({
      userId: z.string().describe("The ID of the user"),
      includeDetails: z.boolean().optional().describe("Whether to include user details"),
    });

    const result = resolveParams("query", zodSchema);

    const expectedParams: ParameterObject[] = [
      {
        in: "query",
        name: "userId",
        required: true,
        description: "The ID of the user",
        schema: {
          type: "string",
          description: "The ID of the user",
        },
      },
      {
        in: "query",
        name: "includeDetails",
        required: false,
        description: "Whether to include user details",
        schema: {
          type: "boolean",
          description: "Whether to include user details",
        },
      },
    ];

    expect(result).toEqual(expectedParams);
  });

  it("should handle required properties correctly", () => {
    const zodSchema = z.object({
      userId: z.string().describe("The ID of the user"),
      includeDetails: z.boolean().optional().describe("Whether to include user details"),
    });

    const result = resolveParams("query", zodSchema);

    const expectedParams: ParameterObject[] = [
      {
        in: "query",
        name: "userId",
        required: true,
        description: "The ID of the user",
        schema: {
          type: "string",
          description: "The ID of the user",
        },
      },
      {
        in: "query",
        name: "includeDetails",
        required: false,
        description: "Whether to include user details",
        schema: {
          type: "boolean",
          description: "Whether to include user details",
        },
      },
    ];

    expect(result).toEqual(expectedParams);
  });
});
