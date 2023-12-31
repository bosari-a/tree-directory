// rollup.config.js
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "index.js",
    format: "esm",
  },
  plugins: [typescript()],
  watch: true,
};
