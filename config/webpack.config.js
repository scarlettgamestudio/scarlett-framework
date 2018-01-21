const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");
const path = require("path");
const WebpackNotifierPlugin = require("webpack-notifier");
const packageName = require("../package.json").shortName;

// transpiling to Editor ES6? (for editor)
const TO_EDITOR_ES6 = process.env.NODE_ENV === "editor";
// deploying? (for complete games)
const DEPLOYING = process.env.NODE_ENV === "production";

// the variable name from which the library should be accessed from
// when using a global var (ES6)
const globalLibraryName = "SC";

// default package name (ES6)
let finalPackageName = packageName + ".browser";
// default relative output path
// it changes depending on the target (i.e., Editor ES6, production or Browser ES6 by default)
let relativeOutputPath = "build/browser";

// default loaders when transpiling to Browser ES6
let loadersSetup = [
  {
    loader: "babel-loader",
    options: {
      plugins: ["transform-runtime", "lodash"],
      presets: [
        [
          "env",
          {
            targets: {
              browsers: ["last 2 versions"]
            },
            modules: false
          }
        ],
        "flow",
        "stage-3"
      ],
      retainLines: true
    }
  }
];

// if transpiling to Editor ES6
if (TO_EDITOR_ES6) {
  // remove presets from babel loader that would otherwise transpile to Browser ES6
  // it's important to have lodash plugin, as it will only import the used functions
  loadersSetup = {
    loader: "babel-loader",
    options: {
      plugins: ["lodash"],
      presets: ["flow"],
      retainLines: true
    }
  };
  // update output path
  relativeOutputPath = "build/umd";
  // update package name
  finalPackageName = packageName;
} else if (DEPLOYING) {
  // update output path
  relativeOutputPath = "build/dist";
  // update package name to an ES6 minified version
  finalPackageName = packageName + ".browser.min";
}

// the entry filename of the library (inside src)
const entryFilenames = ["matter-js", "index.js"];

const config = {
  // TODO: check if targeting electron with webpack is better in some way (i.e., target: electron)

  // devtool is already set with -d (debug) and removed with -p (production) flags from webpack and webpack dev server
  // devtool: 'source-map',

  // Library (or app) entry point (webpack will look for it in the 'src' directory due to the modules setting below).
  entry: entryFilenames,
  // Output the bundled JS to dist/app.js
  output: {
    filename: finalPackageName + ".js",
    path: path.resolve(relativeOutputPath),
    // export itself to UMD format
    libraryTarget: "umd",
    // name of the global var
    library: globalLibraryName,
    umdNamedDefine: true,
    // webpack dev server hot reload path
    publicPath: relativeOutputPath
  },
  resolve: {
    // Look for modules in .js files first
    extensions: [".js", ".json"],
    // Add 'src' to our modules, as all our app code will live in there, so Webpack should look in there for modules
    modules: ["src", "node_modules"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // Skip any files outside of `src` directory
        include: /src/,
        exclude: /node_modules/,
        // loaders depending on target (ES6 or ES5)
        use: loadersSetup
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    //new webpack.optimize.CommonsChunkPlugin("matter"),
    /*new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: false
    }),*/
    // Set up the notifier plugin - you can remove this (or set alwaysNotify false) if desired
    new WebpackNotifierPlugin({ alwaysNotify: true })
    //new BundleAnalyzerPlugin()
  ]
};

module.exports = config;
