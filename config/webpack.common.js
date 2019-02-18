const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");

// the variable name from which the library should be accessed from
// when using a global var (ES6)
const globalLibraryName = "SC";
// the entry filename of the library (inside src)
const entryFilenames = ["matter-js", "index.js"];
// libraries that should be installed by the consumer
const externals = ["fs", "util", "util.promisify", "scarlett-msdf-bmfont-xml"];

module.exports = {
  entry: entryFilenames,
  // devtool is already set with -d (debug) and removed with -p (production) flags from webpack and webpack dev server
  // devtool: 'source-map',

  // Output the bundled JS as UMD (Universal Module definition)
  output: {
    library: globalLibraryName,
    // export itself to UMD format
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  resolve: {
    // Look for modules in .js files first
    extensions: [".js", ".json"],
    // Add 'src' to our modules, as all our app code will live in there, so Webpack should look in there for modules
    modules: ["src", "node_modules"]
  },
  externals: externals,
  plugins: [new LodashModuleReplacementPlugin(), new WebpackNotifierPlugin({ alwaysNotify: true })]
};
