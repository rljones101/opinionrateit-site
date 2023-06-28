/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  ignorePatterns: [
      "/amplify/**/*.js",
      "/amplify/types/**/*.ts",
      "env.d.ts",
    "tailwind.config.js",
    "*.spec.js",
    "*.spec.ts",
    ".eslintrc.cjs"
  ],
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  // add your custom rules here
  rules: {

  }
}
