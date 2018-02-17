const webpackMerge = require("webpack-merge");
const path = require("path");
const packageName = require("../package.json").shortName;
const addons = require("./addons/addons");
const commonConfig = require("./webpack.common");
const browserConfig = require("./webpack.browser");
const editorConfig = require("./webpack.editor");
const deployBrowserConfig = require("./webpack.deploy.browser");
const deployEditorConfig = require("./webpack.deploy.editor");

module.exports = (env = {}) => {
  // transpiling to Editor ES6? (for editor)
  const TO_EDITOR_ES6 = env.target === "editor";
  // deploying? (for complete games)
  const DEPLOYING = process.env.NODE_ENV === "production";

  // use browser configuration by default
  let config = {};

  if (TO_EDITOR_ES6) {
    config = webpackMerge(commonConfig, editorConfig);
  } else {
    // target browser by default
    config = webpackMerge(commonConfig, browserConfig);
  }

  if (DEPLOYING && TO_EDITOR_ES6) {
    config = webpackMerge(config, deployEditorConfig);
  } else if (DEPLOYING) {
    // deploy ES6 (e.g., for finished games)
    // merge actual configuration (browser) and deploy config changes
    config = webpackMerge(config, deployBrowserConfig);
  }

  console.log(config);

  return webpackMerge(config, ...addons(env.addons));
};
