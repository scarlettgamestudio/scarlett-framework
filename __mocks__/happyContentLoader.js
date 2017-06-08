let ContentLoader = require.requireActual("../src/common/contentLoader")
  .ContentLoader;

ContentLoader._loadImage = function() {
  return Promise.resolve("Success");
};

// eslint-disable-next-line
module.exports = ContentLoader;
