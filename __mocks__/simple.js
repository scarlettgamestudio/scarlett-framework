let Simple = require.requireActual("../src/common/simple.js").Simple;

Simple.prototype.methodA = function() {
  return "testttt";
};

// eslint-disable-next-line
module.exports = Simple;
