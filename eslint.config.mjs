import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next"],
    rules: {
      "no-var": "off",
      "@next/next/no-sync-scripts": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  }),
];

export default eslintConfig;
