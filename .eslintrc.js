module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/vue3-essential", "@vue/airbnb"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        objects: "always-multiline",
        functions: "never"
      }
    ]
  }
};
