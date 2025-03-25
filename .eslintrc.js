'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['ember', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    // This convention was only useful when depending on the default model hook implementation, which has been removed:
    // More info: https://github.com/ember-cli/eslint-plugin-ember/issues/2060#issuecomment-2358844541
    'ember/routes-segments-snake-case': 'off',
    'ember/no-jquery': 'error',
    semi: 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'off',
  },
  overrides: [
    // ts files
    {
      files: ['**/*.ts'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        'ember/no-jquery': 'error',
        semi: 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],

        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'error',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        'no-extra-semi': 'off',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-this-alias': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/triple-slash-reference': 'error',
        // rules requiring typechecking (aka slower)

        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        'no-implied-eval': 'off',
        '@typescript-eslint/no-implied-eval': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        // For some reason, these cause eslint to error on imports from `.gts` files, even though TS
        // is perfectly happy with them. We'll still get type errors from TS, so don't need these.
        // '@typescript-eslint/no-unsafe-assignment': 'error',
        // '@typescript-eslint/no-unsafe-call': 'error',
        // '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/prefer-regexp-exec': 'error',
        'require-await': 'off',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/restrict-template-expressions': 'error',
        '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
        '@typescript-eslint/no-shadow': 'error',
      },
    },
    //gts files
    {
      files: ['**/*.gts'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
      },
    },
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.stylelintrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './lib/*/index.js',
        './server/**/*.js',
      ],
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ],
};
