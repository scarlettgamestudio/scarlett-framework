const path = require("path");
const packageName = require("../package.json").shortName;
const relativeOutputPath = "build/dist";
const finalPackageName = packageName + ".min.js";
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

//const MinifyPlugin = require("babel-minify-webpack-plugin");

const loaderSetup = {
  loader: "babel-loader",
  options: {
    plugins: ["lodash"],
    presets: ["flow"],
    retainLines: true
  }
};

module.exports = {
  // TODO: check if targeting electron with webpack is better in some way
  // devtool is already set with -d (debug) and removed with -p (production) flags from webpack and webpack dev server
  devtool: " ",
  // devtool: 'source-map',

  mode: "production",
  optimization: {
    minimizer: [
      /*
      new MinifyPlugin({
        mangle: {
          keepClassName: true,
          keepFnName: true,
          topLevel: false
        }
      })*/

      new UglifyJSPlugin({
        uglifyOptions: {
          warning: "verbose",
          ecma: 6,
          beautify: false,
          compress: false,
          comments: false,
          mangle: false,
          toplevel: false,
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },

  // Output the bundled JS to dist/app.js
  output: {
    filename: finalPackageName,
    path: path.resolve(relativeOutputPath),
    // webpack dev server hot reload path
    publicPath: relativeOutputPath
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
  }
};
