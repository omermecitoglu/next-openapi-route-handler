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
  ],
  esbuildPlugins: [
  ],
});
