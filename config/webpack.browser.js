const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");
const path = require("path");
const WebpackNotifierPlugin = require("webpack-notifier");
const packageName = require("../package.json").shortName;

const relativeOutputPath = "build/browser";
const finalPackageName = packageName + "browser.js";

const loaderSetup = [
  {
    loader: "babel-loader",
    options: {
      plugins: [
        "transform-runtime",
        "lodash",
        [
          "flow-runtime",
          {
            assert: true,
            warn: false,
            annotate: false
          }
        ]
      ],
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

let config = {
  target: "web",
  // devtool is already set with -d (debug) and removed with -p (production) flags from webpack and webpack dev server
  // devtool: 'source-map',

  // Output the bundled JS to dist/app.js
  output: {
    filename: finalPackageName,
    path: path.resolve(relativeOutputPath),
    // export itself to UMD format
    libraryTarget: "umd",
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
        use: loaderSetup
      }
    ]
  },
  plugins: [new LodashModuleReplacementPlugin(), new WebpackNotifierPlugin({ alwaysNotify: true })]
};

module.exports = config;
