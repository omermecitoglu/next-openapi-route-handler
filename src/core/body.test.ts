/* eslint-disable no-console */
import { describe, expect, it, jest } from "@jest/globals";
import z from "zod";
import type { FixedRequest } from "~/types/request";
import { parseRequestBody, resolveRequestBody } from "./body";

describe("resolveRequestBody", () => {
  it("should return undefined when no source is provided", () => {
    const result = resolveRequestBody("none");
    expect(result).toBeUndefined();
  });

  it("should return a RequestBodyObject when a Zod schema is provided", () => {
    const schema = z.object({
      name: z.string(),
    });

    const result = resolveRequestBody("none", schema);

    expect(result).toEqual({
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            required: ["name"],
            additionalProperties: false,
          },
        },
      },
    });
  });

  it("should handle formData content type", () => {
    const schema = z.object({
      file: z.instanceof(File),
    });

    const result = resolveRequestBody("none", schema, true);

    expect(result).toEqual({
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
            },
            required: ["file"],
            additionalProperties: false,
          },
        },
      },
    });
  });
});

describe("parseRequestBody", () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  const mockRequest = {
    json: jest.fn(),
    formData: jest.fn(),
  } as unknown as FixedRequest<z.infer<typeof schema>>;

  it("should return null if no schema is provided", async () => {
    const result = await parseRequestBody(mockRequest, "POST");
    expect(result).toBeNull();
  });

  it("should throw an error if method is GET", async () => {
    await expect(parseRequestBody(mockRequest, "GET", schema)).rejects.toThrow("GET routes can't have request body");
  });

  it("should parse valid JSON request body", async () => {
    (mockRequest.json as jest.Mock).mockResolvedValue({ name: "John", age: 30 } as never);

    const result = await parseRequestBody(mockRequest, "POST", schema);

    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should throw an error for invalid JSON request body", async () => {
    (mockRequest.json as jest.Mock).mockResolvedValue({ name: "John" } as never);

    const originalLog = console.log;
    console.log = jest.fn();

    await expect(parseRequestBody(mockRequest, "POST", schema)).rejects.toThrow("PARSE_REQUEST_BODY");

    expect(console.log).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        code: "invalid_type",
        expected: "number",
        received: "undefined",
      }),
    ]));

    console.log = originalLog; // Restore original console.log
  });

  it("should parse valid formData request body", async () => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("age", "30");

    (mockRequest.formData as jest.Mock).mockResolvedValue(formData as never);

    const result = await parseRequestBody(mockRequest, "POST", schema, true);

    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should throw an error for invalid formData request body", async () => {
    const formData = new FormData();
    formData.append("name", "John");

    (mockRequest.formData as jest.Mock).mockResolvedValue(formData as never);

    const originalLog = console.log;
    console.log = jest.fn();

    await expect(parseRequestBody(mockRequest, "POST", schema, true)).rejects.toThrow("PARSE_FORM_DATA");

    expect(console.log).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        code: "invalid_type",
        expected: "number",
        received: "undefined",
      }),
    ]));

    console.log = originalLog; // Restore original console.log
  });
});
