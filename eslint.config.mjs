import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {languageOptions: {globals: globals.browser}},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/*.spec.ts",
      "node_modules",
      "documentation",
      "dist",
      "coverage",
      "assets",
      "tsconfig.json",
      ".angular",
      "jest-setup.ts",
      "jest.config.ts",
      "yarn.lock",
      "pnpm-lock.yaml",
      "package.json"
    ]
  },
  {
    rules: {
      "indent": ["error", 2],
      "angular/on-watch": "off",
      "semi": [
        "error",
        "always"
      ],
      "dot-location": [
        "error",
        "property"
      ],
      "dot-notation": "error",
      "eqeqeq": [
        "error",
        "always"
      ],
      "no-multi-spaces": [
        "error",
        {
          "ignoreEOLComments": true
        }
      ],
      "key-spacing": [
        "error",
        {
          "afterColon": true
        }
      ],
      "no-redeclare": [
        "error",
        {
          "builtinGlobals": true
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@angular-eslint/template/interactive-supports-focus": "off",
      "for-direction": "error",
      "no-this-alias": "off",
      "getter-return": "error",
      "@angular-eslint/no-output-on-prefix": "off",
      "no-compare-neg-zero": "error",
      "no-constant-condition": "error",
      "no-control-regex": "error",
      "no-debugger": "error",
      "no-dupe-args": "error",
      "no-dupe-else-if": "error",
      "no-dupe-keys": "error",
      "no-empty-function": [
        "error",
        {
          "allow": [
            "functions",
            "arrowFunctions",
            "asyncFunctions",
            "asyncMethods",
            "constructors",
            "getters",
            "setters",
            "generatorFunctions",
            "methods",
            "generatorMethods"
          ]
        }
      ],
      "no-duplicate-case": "error",
      "no-empty-character-class": "error",
      "no-ex-assign": "error",
      "no-extra-boolean-cast": "error",
      "no-func-assign": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-inner-declarations": [
        "error",
        "both"
      ],
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-loss-of-precision": "error",
      "no-misleading-character-class": "error",
      "no-obj-calls": "error",
      "no-template-curly-in-string": "error",
      "no-unexpected-multiline": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {"argsIgnorePattern": "^_"}
      ],
      "no-unsafe-finally": "error",
      "no-unsafe-negation": [
        "error",
        {
          "enforceForOrderingRelations": true
        }
      ],
      "no-unsafe-any": 0,
      "no-unsafe-member-access": 0,
      "no-unsafe-assignment": 0,
      "no-unsafe-optional-chaining": 0,
      "use-isnan": "error",
      "valid-typeof": "error",
      "no-duplicate-imports": "error",
      "brace-style": "error",
      "camelcase": "error",
      "comma-dangle": [
        "error",
        "never"
      ],
      "comma-spacing": [
        "error",
        {
          "before": false,
          "after": true
        }
      ],
      "comma-style": [
        "error",
        "last"
      ],
      "keyword-spacing": [
        "error",
        {
          "before": true
        }
      ],
      "no-trailing-spaces": "error",
      "no-unneeded-ternary": "error",
      "operator-assignment": [
        "error",
        "always"
      ],
      "spaced-comment": [
        "error",
        "always",
        {
          "line": {
            "markers": [
              "/"
            ],
            "exceptions": [
              "-",
              "+"
            ]
          },
          "block": {
            "markers": [
              "!"
            ],
            "exceptions": [
              "*"
            ],
            "balanced": true
          }
        }
      ],
      "no-delete-var": "error",
      "no-shadow-restricted-names": "error",
      "no-undef": "off",
      "no-undef-init": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-escape": "error",
      "no-useless-return": "error",
      "no-unmodified-loop-condition": "error",
      "no-throw-literal": "error",
      "no-self-compare": "error",
      "no-self-assign": "error",
      "no-octal-escape": "error",
      "no-octal": "error",
      "no-new-wrappers": "error",
      "no-new-func": "error",
      "no-new": "error",
      "no-multi-str": "error",
      "no-lone-blocks": "error",
      "no-constructor-return": "error",
      "@typescript-eslint/no-inferrable-types": [
        0,
        {
          "ignoreParameters": true
        }
      ],
      "default-case": "error",
      "default-case-last": "error",
      "tsdoc/syntax": "off",
      "space-before-function-paren": 0
    }
  }
];
