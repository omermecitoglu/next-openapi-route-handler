import { describe, expect, it } from "@jest/globals";
import type { ResponseCollection } from "~/types/response";
import { addBadRequest, bundleResponses } from "./responses";

describe("addBadRequest", () => {
  it("should return undefined if neither queryParams nor requestBody are provided", () => {
    const result = addBadRequest();
    expect(result).toBeUndefined();
  });

  it("should return a bad request response when queryParams are provided", () => {
    const result = addBadRequest({ someQuery: "value" });
    expect(result).toEqual({ description: "Bad Request" });
  });

  it("should return a bad request response when requestBody is provided", () => {
    const result = addBadRequest(undefined, { someBody: "value" });
    expect(result).toEqual({ description: "Bad Request" });
  });

  it("should return a bad request response when both queryParams and requestBody are provided", () => {
    const result = addBadRequest({ someQuery: "value" }, { someBody: "value" });
    expect(result).toEqual({ description: "Bad Request" });
  });
});

describe("bundleResponses", () => {
  it("should return an empty when no responses are provided", () => {
    expect(bundleResponses({})).toEqual({});
  });

  it("should return bundled responses with correct descriptions and resolved content", () => {
    const collection: ResponseCollection<Record<number, unknown>> = {
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

  it("should handle custom content", () => {
    const result = bundleResponses({
      200: {
        description: "Success",
        customContent: {
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
    });

    expect(result).toEqual({
      200: {
        description: "Success",
        content: {
          "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
    });
  });
});
