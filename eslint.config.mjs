import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["supabase/functions/**/*.ts", "supabase/functions/**/*.tsx"],
}, ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"), {
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "prefer-const": "off"
    }
}];