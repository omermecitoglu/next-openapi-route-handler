import { describe, expect, it } from "@jest/globals";
import z from "zod";
import { isFile } from "./zod-schema";

describe("isFile", () => {
  it("should return true for a valid file schema", () => {
    const fileSchema = z.instanceof(File);
    const result = isFile(fileSchema);
    expect(result).toBe(true);
  });

  it("should return false for a non-File type in schema", () => {
    expect(isFile(z.string())).toBe(false);
    expect(isFile(z.number())).toBe(false);
  });
});
