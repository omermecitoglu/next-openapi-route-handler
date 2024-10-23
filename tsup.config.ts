import { readFileSync } from "node:fs";
import { type Plugin } from "esbuild";
import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "dist",
  entry: [
    "src/index.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  clean: true,
  external: [
  ],
  noExternal: [
    // "zod-to-json-schema", // uncomment this during development
  ],
  esbuildPlugins: [
  ],
});
