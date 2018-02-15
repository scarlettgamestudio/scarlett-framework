const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        beautify: false,
        ecma: 6,
        compress: true,
        comments: false,
        mangle: false
      }
    })
  ]
};
