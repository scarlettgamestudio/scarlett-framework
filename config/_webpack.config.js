const webpackMerge = require("webpack-merge");
const path = require("path");
const packageName = require("../package.json").shortName;
const addons = require("./addons/addons");
const commonConfig = require("./webpack.common");
const browserConfig = require("./webpack.browser");
const editorConfig = require("./webpack.editor");
const deployConfig = require("./webpack.deploy");

module.exports = env => {
  // make sure to have a valid env flag
  if (env === undefined) {
    env = {};
  }

  // transpiling to Editor ES6? (for editor)
  const TO_EDITOR_ES6 = process.env.NODE_ENV === "editor";
  // deploying? (for complete games)
  const DEPLOYING = process.env.NODE_ENV === "production";

  // use browser configuration by default
  let config = webpackMerge(commonConfig, browserConfig);

  // if transpiling to Editor ES6
  if (TO_EDITOR_ES6) {
    config = webpackMerge(commonConfig, editorConfig);
  } else if (DEPLOYING) {
    // deploy ES6 (e.g., for finished games)
    // merge actual configuration (browser) and deploy config changes
    config = webpackMerge(config, deployConfig);
  }

  return webpackMerge(config, ...addons(env.addons));
};
