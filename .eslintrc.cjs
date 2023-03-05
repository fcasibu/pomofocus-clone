module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: null,
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
    ],
    'import/no-unresolved': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': [2],
    '@typescript-eslint/no-empty-function': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': [2, { functions: false }],
    '@typescript-eslint/consistent-type-imports': [
      2,
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
      },
    ],
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'comma-dangle': [2, 'always-multiline'],
  },
};
