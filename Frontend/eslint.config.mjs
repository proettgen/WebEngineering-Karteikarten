import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals", "eslint:recommended"),

    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        "no-var": "error",
        "prefer-const": "error",
        "prefer-arrow-callback": "error",
        "arrow-body-style": ["error", "as-needed"],
        "func-style": ["error", "expression"],

        "no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],

        "no-console": "warn",
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    plugins: {
        "@typescript-eslint": tseslint.plugin,
    },

    rules: {
        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],
    },
}]);