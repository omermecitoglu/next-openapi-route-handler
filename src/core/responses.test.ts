import { describe, expect, it } from "@jest/globals";
import type { ResponseDefinition } from "~/types/response";
import zodIssue from "~/zod/issue.json";
import { addBadRequest, bundleResponses } from "./responses";

describe("addBadRequest", () => {
  const badRequestContent = {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          errorType: {
            enum: [
              "PARSE_FORM_DATA_ERROR",
              "PARSE_REQUEST_BODY_ERROR",
              "PARSE_SEARCH_PARAMS_ERROR",
            ],
            type: "string",
          },
          success: {
            type: "boolean",
          },
          zodIssues: {
            type: "array",
            items: zodIssue,
          },
        },
        required: ["success", "errorType", "zodIssues"],
        additionalProperties: false,
      },
    },
  };

  it("should return undefined if neither queryParams nor requestBody are provided", () => {
    const result = addBadRequest();
    expect(result).toBeUndefined();
  });

  it("should return a bad request response when queryParams are provided", () => {
    const result = addBadRequest({ someQuery: "value" });
    expect(result).toEqual({
      description: "Bad Request",
      content: badRequestContent,
    });
  });

  it("should return a bad request response when requestBody is provided", () => {
    const result = addBadRequest(undefined, { someBody: "value" });
    expect(result).toEqual({
      description: "Bad Request",
      content: badRequestContent,
    });
  });

  it("should return a bad request response when both queryParams and requestBody are provided", () => {
    const result = addBadRequest({ someQuery: "value" }, { someBody: "value" });
    expect(result).toEqual({
      description: "Bad Request",
      content: badRequestContent,
    });
  });
});

describe("bundleResponses", () => {
  it("should return an empty when no responses are provided", () => {
    const collection: Record<string, ResponseDefinition> = {};
    const result = bundleResponses(collection);
    expect(result).toEqual({});
  });

  it("should return bundled responses with correct descriptions and resolved content", () => {
    const collection: Record<string, ResponseDefinition> = {
      200: { description: "Success", content: "SomeContent", isArray: false },
      404: { description: "Not Found", content: "SomeOtherContent", isArray: true },
    };

    const result = bundleResponses(collection);

    expect(result).toEqual({
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SomeContent",
            },
          },
        },
      },
      404: {
        description: "Not Found",
        content: {
          "application/json": {
            schema: {
              items: {
                $ref: "#/components/schemas/SomeOtherContent",
              },
              type: "array",
            },
          },
        },
      },
    });

    expect(result).toEqual({
      200: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SomeContent",
            },
          },
        },
        description: "Success",
      },
      404: {
        content: {
          "application/json": {
            schema: {
              items: {
                $ref: "#/components/schemas/SomeOtherContent",
              },
              type: "array",
            },
          },
        },
        description: "Not Found",
      },
    });
  });
});
