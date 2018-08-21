module.exports = {
  "plugins": ["jest"],
  "extends": 'jest-enzyme',
  env: {
    // Don't error on jest globals, e.g. jest, describe, it
    'jest': true,
    'jasmine': true
  }
}
