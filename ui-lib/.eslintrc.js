module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension
      parserOptions: {
        project: ["./tsconfig.json"], // Specify it only for TypeScript files
      },
    },
    {
      rules: {
        "strict-boolean-expressions": [
          0,
          "allow-null-union",
          "allow-undefined-union",
          "allow-string",
          "allow-enum",
          "allow-number",
          "allow-boolean-or-undefined",
          "allow-nullable-boolean"
        ]
      }
    }
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "flowtype", "jest"],
  rules: {
    "space-before-function-parent": 0,
    "comma-dangle": 0,
    "no-prototype-builtins": 0,
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "strict-boolean-expressions": [
      0,
      "allow-null-union",
      "allow-undefined-union",
      "allow-string",
      "allow-enum",
      "allow-number",
      "allow-boolean-or-undefined",
      "allow-nullable-boolean"
    ]
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: ["standard-with-typescript", "prettier"],
};
