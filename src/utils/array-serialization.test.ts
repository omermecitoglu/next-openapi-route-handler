import { describe, expect, it } from "vitest";
import { deserializeArray, serializeArray } from "./array-serialization";

describe("serializeArray", () => {
  it("should serialize an array of strings into a comma-separated string", () => {
    const input = ["apple", "banana", "cherry"];
    const result = serializeArray(input);
    expect(result).toBe("apple,banana,cherry");
  });

  it("should handle an empty array", () => {
    const input: string[] = [];
    const result = serializeArray(input);
    expect(result).toBe("");
  });

  it("should handle an array with one item", () => {
    const input = ["apple"];
    const result = serializeArray(input);
    expect(result).toBe("apple");
  });

  it("should handle an array with empty strings", () => {
    const input = ["apple", "", "banana"];
    const result = serializeArray(input);
    expect(result).toBe("apple,,banana");
  });
});

describe("deserializeArray", () => {
  it("should deserialize a comma-separated string into an array of strings", () => {
    const input = "apple,banana,cherry";
    const result = deserializeArray(input);
    expect(result).toEqual(["apple", "banana", "cherry"]);
  });

  it("should handle an empty string", () => {
    const input = "";
    const result = deserializeArray(input);
    expect(result).toEqual([]);
  });

  it("should handle a single item string", () => {
    const input = "apple";
    const result = deserializeArray(input);
    expect(result).toEqual(["apple"]);
  });

  it("should handle a string with empty items", () => {
    const input = "apple,,banana";
    const result = deserializeArray(input);
    expect(result).toEqual(["apple", "", "banana"]);
  });
});
