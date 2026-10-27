import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/demo-app/**",
  ]),
  {
    files: ["demo/src/**/*.{js,jsx}"],
    // The standalone client intentionally uses native bitmap icons from RemCard
    // and a fixed fictional patient clock rather than Next.js image/SSR APIs.
    rules: {
      "no-undef": "error",
      "@next/next/no-img-element": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
