import { describe, expect, it } from "vitest";
import { defineRoute } from ".";

describe("defineRoute", () => {
  it("must be a function", () => {
    expect(typeof defineRoute).toBe("function");
  });
});
