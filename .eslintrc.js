/* eslint-disable quotes */
/* eslint-disable quote-props */

module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "airbnb-base",
    "eslint:recommended",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "no-console": 0,
    "no-shadow": 0,
    "no-trailing-spaces": 0,
    "no-underscore-dangle": 0,
    "no-unresolved": 0,
    "newline-after-import": 0,
    "no-unused-vars": 0,
    "spaced-comment": 0,
    "keyword-spacing": 0,
    "object-curly-spacing": 0,
    "object-curly-newline": 0,
    "max-len": 0,
    "indent": 0,
    "comma-dangle": 0
  },
};
