module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "globals": {
    "chrome": true,
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],
  },
  "parserOptions": {
      "sourceType": "module",
      "ecmaVersion":  2017
  }
};
