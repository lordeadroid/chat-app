module.exports = {
  env: {
    es2022: true,
  },
  rules: {
    semi: ["error"],
    quotes: ["error", "double"],
    "arrow-parens": ["error", "always"],
    "comma-spacing": ["error", { after: true }],

    "no-unsafe-optional-chaining": ["error"],
    //
    "no-unused-vars": ["error", { varsIgnorePattern: "_" }],
    //unused variable
    "space-infix-ops": ["error"],
    //space before and after mathematical operators
    "constructor-super": ["error"],
    //use of super when inheriting other class
    "func-call-spacing": ["error"],
    //use of space between function name and round brackets
    "class-methods-use-this": ["warn"],
    //use of this inside class
    // "no-console": "error",
    semi: "warn",
    "array-callback-return": ["error", { checkForEach: false }],
    "no-cond-assign": "error",
    "no-dupe-keys": "error",
    "no-fallthrough": "warn",
    "no-sparse-arrays": "warn",
    "no-this-before-super": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
    camelcase: "warn",
    complexity: ["warn", 10],
    "default-param-last": "error",
    "dot-notation": "warn",
    eqeqeq: "warn",
    "max-depth": ["warn", 3],
    "max-statements": "warn",
    "new-cap": "error",
    "no-eval": "warn",
    "no-extra-semi": "warn",
    "no-nested-ternary": "warn",
    "no-plusplus": "warn",
    "no-undef-init": "warn",
    "no-unneeded-ternary": "error",
    "no-useless-escape": "warn",
    "prefer-const": "warn",
    "comma-spacing": ["warn", { before: false, after: true }],
    "key-spacing": ["error", { afterColon: true }],
    "max-len": "error",
    "no-multiple-empty-lines": "error",
  },
};
