// @ts-check

const {defineConfig} = require('eslint-define-config');

module.exports = defineConfig({
    env: {
        browser: true,
        // ES2020 had: `??`, `?.`, `BigInt`
        es2020: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'react'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'react': {
            'version': 'detect',
        },
    },
    rules: {
        'array-bracket-spacing': ['error', 'never'],
        'comma-dangle': ['error', 'always-multiline'],
        'eqeqeq': ['warn', 'always'],
        'indent': ['error', 4, {SwitchCase: 1}],
        'object-curly-newline': ['error', {consistent: true}],
        'object-curly-spacing': ['error', 'never'],
        'max-len': ['error', 100],
        'no-debugger': 'error',
        'no-empty': 'warn',
        'no-process-exit': 'off',
        'no-useless-escape': 'off',
        'prefer-const': [
            'error',
            {
                destructuring: 'all',
            },
        ],
        'quotes': ['error', 'single', {avoidEscape: true}],
        'semi': 'error',
        'sort-imports': 'off',

        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-nodejs-modules': [
            'error',
            {
                allow: ['node:path'],
            },
        ],
        'import/order': 'off',
        'simple-import-sort/exports': 'warn',
        'simple-import-sort/imports': [
            'error',
            {
                /**
                 * Regex Reference:
                 *  - '.': Any character except newline.
                 *  - '*': Zero or more of the preceding item.
                 *  - '|': Boolean OR. Matches the expression before or after the `|`.
                 *  - '^': Start of the string.
                 *  - '$': End of the string.
                 *
                 * Groups Reference
                 *  - Groups are defined in separate lists.
                 *  - Groups are separated by a newline character in the source code.
                 *
                 * - '^\\u0000': Side effect imports.
                 *  For example: import './polyfills'
                 *
                 * - '^node:': Node.js builtins prefixed with `node:`.
                 *  For example: `import fs from 'node:fs';`
                 * - '^@?\\w': 3rd party packages.
                 *  Starts with a letter/digit/underscore, or `@` followed by a letter.
                 *  For example: `import {useState} from 'react';`
                 *
                 * - '^~(/.*|$)': Imports that start with `~/`
                 *  For example: `import packageJson from '~/package.json';`
                 *
                 * - '^!(/.*|$)': Imports that start with `!/`
                 *  For example: `import {myHelper} from '!/helpers/my-helper';`
                 *
                 * - '^@(/.*|$)': Imports that start with `@/`
                 *  For example: `import {mySource} from '@/sources/my-source';`
                 *
                 * - '^': Absolute imports and other imports not matched in another group.
                 * - '^\\.': Relative imports. Anything that starts with a dot.
                 */
                groups: [
                    ['^\\u0000'],
                    ['^node:', '^@?\\w'],
                    ['^~(/.*|$)'],
                    ['^!(/.*|$)'],
                    ['^@(/.*|$)'],
                    ['^', '^\\.'],
                ],
            },
        ],

        'react/react-in-jsx-scope': 'off',

        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/explicit-module-boundary-types': [
            'error',
            {allowArgumentsExplicitlyTypedAsAny: true},
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-extra-semi': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
    },
    overrides: [
        {
            files: ['packages/**'],
            excludedFiles: ['**/__tests__/**'],
            rules: {
                'no-restricted-globals': ['error', 'require', '__dirname', '__filename'],
            },
        },
        {
            files: ['**/scripts/**'],
            rules: {
                'n/no-extraneous-import': 'off',
            },
        },
        {
            files: ['*.spec.ts'],
            rules: {
                'n/no-extraneous-import': 'off',
            },
        },
        {
            files: ['**/vitest.config.ts'],
            rules: {
                'n/no-extraneous-import': 'off',
            },
        },
        {
            files: ['**/build.config.ts'],
            rules: {
                'no-restricted-globals': 'off',
                'no-undef': 'off',
                'n/no-extraneous-import': 'off',
                'n/no-missing-import': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
            },
        },
        {
            files: ['*.cjs'],
            rules: {
                'no-undef': 'off',
            },
        },
        {
            files: ['*.js', '*.mjs', '*.cjs'],
            rules: {
                '@typescript-eslint/explicit-module-boundary-types': 'off',
            },
        },
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/triple-slash-reference': 'off',
            },
        },
    ],
    reportUnusedDisableDirectives: true,
});
