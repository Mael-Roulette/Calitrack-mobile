// eslint.config.js
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = defineConfig([
    ...expoConfig,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        ignores: [
            "node_modules/**",
            "dist/**",
            ".expo/**",
            "android/**",
            "ios/**",
            "*.config.js",
            "*.config.ts"
        ],
        rules: {
            "semi": ["error", "always"],
            "space-before-blocks": ["error", "always"],
            "space-before-function-paren": ["error", "always"],
            "array-bracket-spacing": ["error", "always"],
            "object-curly-spacing": ["error", "always"],
            "react/jsx-curly-spacing": ["error", { "when": "always" }],
            "space-in-parens": ["error", "always"],
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "react/jsx-indent": ["error", 4],
            "quotes": ["error", "double"],
            "space-infix-ops": "error",
            "no-multiple-empty-lines": ["error", { "max": 2 }],
            "eqeqeq": ["error", "always"],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn"],
            "react/jsx-tag-spacing": ["error", { "beforeSelfClosing": "always" }],
            "computed-property-spacing": ["error", "always"],
        },
    },
]);

module.exports = eslintConfig;