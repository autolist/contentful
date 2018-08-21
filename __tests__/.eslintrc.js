module.exports = {
  "plugins": ["jest"],
  env: {
    // Don't error on jest globals, e.g. jest, describe, it
    'jest': true,
    'jasmine': true
  }
}
