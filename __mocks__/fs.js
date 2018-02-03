// __mocks__/fs.js
"use strict";

const path = require("path");

const fs = jest.genMockFromModule("fs");

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const filePath in newMockFiles) {
    const dir = path.dirname(filePath);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }

    const file = {
      basename: path.basename(filePath),
      content: newMockFiles[filePath]
    };
    mockFiles[dir].push(file);
  }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;

fs.writeFile = function(filePath, content, callback) {
  const file = {
    basename: path.basename(filePath),
    content: content
  };

  mockFiles[path.dirname(filePath)].push(file);
  callback(null, content);
};

// eslint-disable-next-line
module.exports = fs;
