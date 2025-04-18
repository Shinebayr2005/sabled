import resolve from "@rollup/plugin-node-resolve"; // Ensure this is imported
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import external from "rollup-plugin-peer-deps-external";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    resolve(), // Add this plugin to handle module resolution
    commonjs(),
    typescript(),
    postcss({
      // extract: "styles.css",
      inject: true,
      plugins: [require("@tailwindcss/postcss"), require("autoprefixer")],
    }),
    terser(),
    external(),
  ],
  external: ["react", "react-dom", "tslib"], // Ensure React and other dependencies are external
};
