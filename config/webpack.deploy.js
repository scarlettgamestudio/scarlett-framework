const path = require("path");
const packageName = require("../package.json").shortName;
// output path
const relativeOutputPath = "build/dist";
// package name to an ES6 minified version
const finalPackageName = packageName + ".browser.min.js";

module.exports = {
  output: {
    path: path.resolve(relativeOutputPath),
    publicPath: relativeOutputPath,
    filename: finalPackageName
  }
};
