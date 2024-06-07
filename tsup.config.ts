import { readFileSync } from "node:fs";
import { type Plugin } from "esbuild";
import { defineConfig } from "tsup";

// A Next.js dependency (ua-parser-js) uses __dirname, which is not supported in Edge environment.
const uaParserDirnamePlugin = (): Plugin => {
  return {
    name: "dirname-plugin",
    setup(build) {
      build.onLoad({ filter: /\/ua-parser-js\// }, async args => {
        let contents = readFileSync(args.path, "utf8");
        contents = contents.replace(/__dirname/g, "");

        return {
          contents,
          loader: "js",
        };
      });
    },
  };
};

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/cli.ts",
    "src/route-handler.ts",
  ],
  external: ["zod", "zod-to-json-schema"],
  bundle: true,
  esbuildPlugins: [uaParserDirnamePlugin()],
  format: ["cjs", "esm"],
  platform: "node",
});
