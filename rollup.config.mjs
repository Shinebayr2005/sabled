import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
    },
    {
      file: "dist/index.mjs",
      format: "es",
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      inject: true,
      minimize: true,
    }),
    typescript({ tsconfig: "./tsconfig.build.json" }),
  ],
  external: ["react", "react-dom"], // Exclude React and ReactDOM
};
