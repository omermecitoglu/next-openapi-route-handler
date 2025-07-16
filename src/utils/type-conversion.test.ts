import { describe, expect, it } from "vitest";
import { convertStringToArray, convertStringToBoolean, convertStringToNumber } from "./type-conversion";

describe("convertStringToNumber", () => {
  it("should convert string values to numbers for specified keys", () => {
    const input = { a: "10", b: "20", c: "30" };
    const result = convertStringToNumber(input, ["a", "b"]);
    expect(result).toEqual({ a: 10, b: 20, c: "30" });
  });

  it("should handle non-numeric strings by keeping them unchanged", () => {
    const input = { a: "abc", b: "20" };
    const result = convertStringToNumber(input, ["a", "b"]);
    expect(result).toEqual({ a: NaN, b: 20 });
  });

  it("should leave unspecified keys unchanged", () => {
    const input = { a: "5", b: "not a number", c: "15" };
    const result = convertStringToNumber(input, ["a", "c"]);
    expect(result).toEqual({ a: 5, b: "not a number", c: 15 });
  });
});

describe("convertStringToBoolean", () => {
  it("should convert string values to booleans for specified keys", () => {
    const input = { a: "true", b: "false", c: "yes", d: "no" };
    const result = convertStringToBoolean(input, ["a", "b", "c", "d"]);
    expect(result).toEqual({ a: true, b: false, c: null, d: null });
  });

  it("should leave unspecified keys unchanged", () => {
    const input = { a: "true", b: "false", c: "maybe" };
    const result = convertStringToBoolean(input, ["a"]);
    expect(result).toEqual({ a: true, b: "false", c: "maybe" });
  });
});

describe("convertStringToArray", () => {
  it("should convert comma-separated strings to arrays for specified keys", () => {
    const input = { a: "apple,banana,cherry", b: "dog,cat" };
    const result = convertStringToArray(input, ["a", "b"]);
    expect(result).toEqual({ a: ["apple", "banana", "cherry"], b: ["dog", "cat"] });
  });

  it("should handle empty strings correctly", () => {
    const input = { a: "", b: "dog,cat" };
    const result = convertStringToArray(input, ["a", "b"]);
    expect(result).toEqual({ a: [], b: ["dog", "cat"] });
  });

  it("should leave unspecified keys unchanged", () => {
    const input = { a: "one,two,three", b: "dog,cat" };
    const result = convertStringToArray(input, ["a"]);
    expect(result).toEqual({ a: ["one", "two", "three"], b: "dog,cat" });
  });
});
