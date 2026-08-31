import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2018",
  outDir: "dist",
  external: ["react", "react-dom", "react-transition-group"],
});
