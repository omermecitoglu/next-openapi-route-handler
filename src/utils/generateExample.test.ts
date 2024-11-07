import { describe, expect, it } from "@jest/globals";
import z, { type ZodType } from "zod";
import generateExample from "./generateExample";

describe("generateExample", () => {
  it("should generate an example from a zod object", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      age: z.number().optional(),
    });
    expect(generateExample(schema, false)).toStrictEqual({
      id: 1,
      name: "example name",
      email: "john.doe@example.com",
      age: 1,
    });
  });

  it("should ignore some props with the ignoreOptionals param is true", () => {
    const schema = z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      age: z.number().optional(),
    });
    expect(generateExample(schema, true)).toStrictEqual({
      id: 1,
      name: "example name",
      email: "john.doe@example.com",
    });
  });

  it("should generate an example from a zod string", () => {
    const schema = z.string();
    expect(generateExample(schema, false)).toBe("example string");
  });

  it("should generate an example from a zod number", () => {
    const schema = z.number();
    expect(generateExample(schema, false)).toBe(1);
    expect(generateExample(z.number().negative(), false)).toBe(-1);
    expect(generateExample(z.number().nonpositive(), false)).toBe(-1);
    expect(generateExample(z.number().multipleOf(7), false)).toBe(7);
  });

  it("should return the minimum value from a zod number with minimum", () => {
    const schema = z.number().min(5);
    expect(generateExample(schema, false)).toBe(5);
  });

  it("should generate an example from a zod integer", () => {
    const schema = z.bigint();
    expect(generateExample(schema, false)).toBe(1n);
  });

  it("should generate an example from a zod boolean", () => {
    const schema = z.boolean();
    expect(generateExample(schema, false)).toBe(false);
  });

  it("should generate an example from a zod undefined", () => {
    const schema = z.undefined();
    expect(generateExample(schema, false)).toBe(undefined);
  });

  it("should generate an example from a zod null", () => {
    const schema = z.null();
    expect(generateExample(schema, false)).toBe(null);
  });

  it("should return the first item from a zod enum", () => {
    const schema = z.enum(["apple", "pear", "orange"]);
    expect(generateExample(schema, false)).toBe("apple");
  });

  it("should return the default value if the schema has one", () => {
    const schema = z.string().default("I think this function will be very useful");
    expect(generateExample(schema, false)).toBe("I think this function will be very useful");
  });

  it("should handle zod string with special types", () => {
    expect(generateExample(z.string().email(), false)).toBe("john.doe@example.com");
    expect(generateExample(z.string().url(), false)).toBe("https://example.com");
    expect(generateExample(z.string().emoji(), false)).toBe("😀");
    expect(generateExample(z.string().uuid(), false)).toBe("aa35d4a1-8f23-4cee-847c-2bfe89dc87c1");
    expect(generateExample(z.string().ip(), false)).toBe("192.168.1.1");
    expect(generateExample(z.string().datetime(), false)).toBe("2024-11-06T07:00:00.137Z");
    expect(generateExample(z.string().startsWith("openapi:"), false)).toBe("openapi:example");
    expect(generateExample(z.string().endsWith(":openapi"), false)).toBe("example:openapi");
  });

  it("should generate an example from a nullable zod string", () => {
    const schema = z.string().nullable();
    expect(generateExample(schema, false)).toBe("example nullable string");
  });

  it("should return undefined from an optional zod string", () => {
    const schema = z.string().optional();
    expect(generateExample(schema, true)).toBe(undefined);
  });

  it("should generate an example from a zod array", () => {
    expect(generateExample(z.string().array(), true)).toStrictEqual(["example string"]);
    expect(generateExample(z.number().array(), true)).toStrictEqual([1]);
    expect(generateExample(z.array(z.union([z.string(), z.number()])), true)).toStrictEqual(["example string", 1]);
  });

  it("should generate an example from a zod union", () => {
    const schema = z.union([z.string(), z.number()]);
    expect(generateExample(schema, true)).toBe("example string");
    const emptyUnion = z.union([] as unknown as [ZodType, ZodType]);
    expect(generateExample(emptyUnion, true)).toBe(undefined);
  });

  it("should throw an error from an unknown zod schema", () => {
    const schema = z.unknown();
    expect(() => generateExample(schema, false)).toThrow("Unknown zod schema");
  });
});
