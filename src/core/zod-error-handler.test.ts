import { describe, expect, it } from "vitest";
import { z } from "zod";
import { safeParse } from "./zod-error-handler";

describe("safeParse", () => {
  const numberSchema = z.object({
    age: z.number(),
  });

  const booleanSchema = z.object({
    isActive: z.boolean(),
  });

  const arraySchema = z.object({
    tags: z.array(z.string()),
  });

  it("should successfully parse valid input for number schema", () => {
    const input = { age: "30" };
    const result = safeParse(numberSchema, input);
    expect(result).toEqual({ age: 30 });
  });

  it("should throw an error for invalid input for number schema", () => {
    const input = { age: "not a number" };
    expect(() => safeParse(numberSchema, input)).toThrow();
  });

  it("should successfully parse valid input for boolean schema", () => {
    const input = { isActive: "true" };
    const result = safeParse(booleanSchema, input);
    expect(result).toEqual({ isActive: true });
  });

  it("should throw an error for invalid input for boolean schema", () => {
    const input = { isActive: "not a boolean" };
    expect(() => safeParse(booleanSchema, input)).toThrow();
  });

  it("should successfully parse valid input for array schema", () => {
    const input = { tags: "tag1,tag2,tag3" };
    const result = safeParse(arraySchema, input);
    expect(result).toEqual({ tags: ["tag1", "tag2", "tag3"] });
  });

  it("should convert non-array strings into an array with that string as the only element", () => {
    const input = { tags: "not an array" };
    const result = safeParse(arraySchema, input);
    expect(result).toEqual({ tags: ["not an array"] });
  });

  it("should convert types and retry parsing if the first attempt fails", () => {
    const input = { age: "25", isActive: "false", tags: "tag1,tag2" };
    const result = safeParse(z.object({
      age: z.number(),
      isActive: z.boolean(),
      tags: z.array(z.string()),
    }), input);
    expect(result).toEqual({ age: 25, isActive: false, tags: ["tag1", "tag2"] });
  });

  it("should throw the original error if unable to convert input", () => {
    const input = { age: "not a number", isActive: "not a boolean" };
    expect(() => safeParse(z.object({
      age: z.number(),
      isActive: z.boolean(),
    }), input)).toThrow();
  });
});
