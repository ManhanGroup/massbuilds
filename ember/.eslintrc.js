module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  extends: 'eslint:recommended',
  env: {
    browser: true,
    es6: true,
  },
  overrides: [
    {
      files: [
        'ember-cli-build.js',
        'testem.js',
        'config/**/*.js',
        'lib/*/index.js',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015,
      },
      env: {
        browser: false,
        node: true,
      },
    },
  ],
};
