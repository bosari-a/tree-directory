// rollup.config.js
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "index.cjs",
    format: "cjs",
  },
  plugins: [typescript()],
  watch: true,
};
