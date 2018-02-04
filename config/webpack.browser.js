const path = require("path");
const packageName = require("../package.json").shortName;
const relativeOutputPath = "build/browser";
const finalPackageName = packageName + ".browser.js";

const loaderSetup = {
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
};

module.exports = {
  target: "web",
  // devtool is already set with -d (debug) and removed with -p (production) flags from webpack and webpack dev server
  // devtool: 'source-map',

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
        use: loaderSetup
      }
    ]
  }
};
