const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: false
    })
  ]
};
