import { describe, expect, it } from "vitest";
import { getTrueBoolean } from "./boolean";

describe("getTrueBoolean", () => {
  it("should return true for the string 'true'", () => {
    const result = getTrueBoolean("true");
    expect(result).toBe(true);
  });

  it("should return false for the string 'false'", () => {
    const result = getTrueBoolean("false");
    expect(result).toBe(false);
  });

  it("should return null for an invalid input", () => {
    const result1 = getTrueBoolean("yes");
    const result2 = getTrueBoolean("no");
    const result3 = getTrueBoolean("");
    const result4 = getTrueBoolean("random string");

    expect(result1).toBe(null);
    expect(result2).toBe(null);
    expect(result3).toBe(null);
    expect(result4).toBe(null);
  });

  it("should return null for a number input as string", () => {
    const result = getTrueBoolean("123");
    expect(result).toBe(null);
  });
});
