module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'arrow-spacing': ['error', { before: true, after: true }],
    'linebreak-style': ['error', 'unix'],
    'no-console': 0,
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    eqeqeq: 'error',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  },
}