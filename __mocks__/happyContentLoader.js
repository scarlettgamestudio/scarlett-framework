let ContentLoader = require.requireActual("../src/common/contentLoader")
  .ContentLoader;

const successMessage = "Success";

ContentLoader._loadImage = function() {
  return Promise.resolve(successMessage);
};

ContentLoader._loadAudio = function() {
  return Promise.resolve(successMessage);
};

ContentLoader._loadFile = function() {
  return Promise.resolve(successMessage);
};

// eslint-disable-next-line
module.exports = ContentLoader;
