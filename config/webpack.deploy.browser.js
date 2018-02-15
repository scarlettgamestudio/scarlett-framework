const path = require("path");
const packageName = require("../package.json").shortName;
// output path
const relativeOutputPath = "build/dist";
// package name to an ES6 minified version
const finalPackageName = packageName + ".browser.min.js";

const loaderSetup = {
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
};

module.exports = {
  output: {
    path: path.resolve(relativeOutputPath),
    publicPath: relativeOutputPath,
    filename: finalPackageName
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
