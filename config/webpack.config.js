const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const WebpackNotifierPlugin = require("webpack-notifier");
const packageName = require("../package.json").shortName;

// transpiling to ES6? (for editor and for some browsers)
const TO_ES6 = process.env.NODE_ENV === "es6";
// deploying? (for complete games)
const DEPLOYING = process.env.NODE_ENV === "production";

// the variable name from which the library should be accessed from
const globalLibraryName = "SC";
// the entry filename of the library (inside src)
const entryFilenames = ["index.js"];

// default package name (ES5)
let finalPackageName = packageName + ".browser.js";
// default relative output path
// it changes depending on the target (i.e., ES6, production or ES5 by default)
let relativeOutputPath = "build/build-es5";
// default loaders when transpiling to ES5 (for running on every browser
// .ts(x) files should first pass through the Typescript loader, and then through babel
let loadersSetup = [
  {
    loader: "babel-loader",
    options: {
      plugins: ["transform-runtime", "lodash"],
      presets: [["es2015", { modules: false }], "stage-3"]
    }
  }
];

// if transpiling to ES6
if (TO_ES6) {
  // remove babel loader that would otherwise transpile to ES5
  loadersSetup = [];
  // update output path
  relativeOutputPath = "build/build-es6";
  // update package name
  finalPackageName = packageName + ".js";
} else if (DEPLOYING) {
  // update output path
  relativeOutputPath = "build/dist";
  // update package name to an ES5 minified version
  finalPackageName = packageName + ".browser.min.js";
}

const config = {
  // TODO: check if targeting electron with webpack is better in some way (i.e., target: electron)

  // devtool is already set with -d (debug) and removed with -p (production) flags from webpack and webpack dev server
  // devtool: 'source-map',

  // Library (or app) entry point (webpack will look for it in the 'src' directory due to the modules setting below).
  entry: entryFilenames,
  // Output the bundled JS to dist/app.js
  output: {
    filename: finalPackageName,
    path: path.resolve(relativeOutputPath),
    // export itself to a global var
    libraryTarget: "var",
    // name of the global var
    library: globalLibraryName,
    // webpack dev server hot reload path
    publicPath: relativeOutputPath
  },
  resolve: {
    // Look for modules in .js(x) files first, then .js(x)
    extensions: [".js", ".jsx"],
    // Add 'src' to our modules, as all our app code will live in there, so Webpack should look in there for modules
    modules: ["src", "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // Skip any files outside of `src` directory
        include: /src/,
        exclude: /node_modules/,
        // loaders depending on target (ES6 or ES5)
        use: loadersSetup
      }
    ]
  },
  plugins: [
    // Set up the notifier plugin - you can remove this (or set alwaysNotify false) if desired
    new WebpackNotifierPlugin({ alwaysNotify: true }),
    new LodashModuleReplacementPlugin()
  ]
};

module.exports = config;
