import { describe, expect, it, vi } from "vitest";
import z from "zod";
import { parseRequestBody, resolveRequestBody } from "./body";

describe("resolveRequestBody", () => {
  it("should return undefined when no source is provided", () => {
    const result = resolveRequestBody();
    expect(result).toBeUndefined();
  });

  it("should return a RequestBodyObject when a Zod schema is provided", () => {
    const schema = z.object({
      name: z.string(),
    });

    const result = resolveRequestBody(schema);

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
      file: z.file(),
    });

    const result = resolveRequestBody(schema, true);

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

  const mockRequest = { json: vi.fn(), formData: vi.fn() };

  it("should return null if no schema is provided", async () => {
    const result = await parseRequestBody(mockRequest as unknown as Request, "POST");
    expect(result).toBeNull();
  });

  it("should throw an error if method is GET", async () => {
    await expect(parseRequestBody(mockRequest as unknown as Request, "GET", schema))
      .rejects.toThrow("GET routes can't have request body");
  });

  it("should parse valid JSON request body", async () => {
    mockRequest.json.mockResolvedValue({ name: "John", age: 30 });

    const result = await parseRequestBody(mockRequest as unknown as Request, "POST", schema);

    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should throw an error for invalid JSON request body", async () => {
    mockRequest.json.mockResolvedValue({ name: "John" });

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { /* do nothing */ });

    await expect(parseRequestBody(mockRequest as unknown as Request, "POST", schema)).rejects.toThrow("PARSE_REQUEST_BODY");

    expect(consoleSpy).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        code: "invalid_type",
        expected: "number",
        received: "undefined",
      }),
    ]));

    consoleSpy.mockRestore();
  });

  it("should parse valid formData request body", async () => {
    const formData = new FormData();
    formData.append("name", "John");
    formData.append("age", "30");

    mockRequest.formData.mockResolvedValue(formData);

    const result = await parseRequestBody(mockRequest as unknown as Request, "POST", schema, true);

    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should throw an error for invalid formData request body", async () => {
    const formData = new FormData();
    formData.append("name", "John");

    mockRequest.formData.mockResolvedValue(formData);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { /* do nothing */ });

    await expect(parseRequestBody(mockRequest as unknown as Request, "POST", schema, true)).rejects.toThrow("PARSE_FORM_DATA");

    expect(consoleSpy).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        code: "invalid_type",
        expected: "number",
        received: "undefined",
      }),
    ]));
    consoleSpy.mockRestore();
  });
});
