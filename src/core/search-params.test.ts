import { describe, expect, it, vi } from "vitest";
import z from "zod";
import parseSearchParams from "./search-params";

describe("parseSearchParams", () => {
  const schema = z.object({
    tags: z.string(),
    age: z.number(),
  });

  it("should return null if schema is not provided", () => {
    const params = new URLSearchParams();
    const result = parseSearchParams(params);
    expect(result).toBeNull();
  });

  it("should serialize array values correctly and parse valid input", () => {
    const params = new URLSearchParams();
    params.append("tags", "tag1");
    params.append("tags", "tag2");
    params.append("age", "30");

    const result = parseSearchParams(params, schema);
    expect(result).toEqual({ tags: "tag1,tag2", age: 30 });
  });

  it("should throw an error for invalid input according to the schema and log error issues in non-production env", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { /* do nothing */ });

    const params = new URLSearchParams();
    params.append("tags", "tag1");
    params.append("age", "not a number");

    expect(() => parseSearchParams(params, schema)).toThrow("PARSE_SEARCH_PARAMS");

    expect(consoleSpy).toHaveBeenCalled(); // Check if console.log was called
    consoleSpy.mockRestore();
  });

  it("should handle multiple keys correctly", () => {
    const params = new URLSearchParams();
    params.append("tags", "tag1");
    params.append("tags", "tag2");
    params.append("age", "25");

    const result = parseSearchParams(params, schema);
    expect(result).toEqual({ tags: "tag1,tag2", age: 25 });
  });
});
