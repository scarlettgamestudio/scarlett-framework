const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const path = require("path");
const packageName = require("../package.json").shortName;
const browserConfig = require("./webpack.browser");
const editorConfig = require("./webpack.editor");
const addons = require("./addons/addons");

module.exports = env => {
  // make sure to have a valid env flag
  if (env === undefined) {
    env = {};
  }

  // transpiling to Editor ES6? (for editor)
  const TO_EDITOR_ES6 = process.env.NODE_ENV === "editor";
  // deploying? (for complete games)
  const DEPLOYING = process.env.NODE_ENV === "production";

  // the variable name from which the library should be accessed from
  // when using a global var (ES6)
  const globalLibraryName = "SC";
  // the entry filename of the library (inside src)
  const entryFilenames = ["matter-js", "index.js"];
  // libraries that should be installed by the consumer
  const externals = ["fs", "msdf-bmfont-xml"];

  // use browser configuration by default
  let config = browserConfig;

  // if transpiling to Editor ES6
  if (TO_EDITOR_ES6) {
    config = editorConfig;
  } else if (DEPLOYING) {
    // update output path
    relativeOutputPath = "build/dist";
    // update package name to an ES6 minified version
    finalPackageName = packageName + ".browser.min.js";
    // overwrite path and filename
    config.output.path = path.resolve(relativeOutputPath);
    config.output.publicPath = relativeOutputPath;
    config.output.filename = finalPackageName;
  }

  config.entry = entryFilenames;
  config.output.library = globalLibraryName;
  config.externals = externals;

  const mergedConfig = webpackMerge(config, ...addons(env.addons));

  return mergedConfig;
};
