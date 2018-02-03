// FileSummarizer.js
"use strict";

const fs = require("fs");

function summarizeFilesInDirectorySync(directory) {
  return fs.readdirSync(directory).map(filename => ({
    directory,
    filename
  }));
}

// eslint-disable-next-line
exports.summarizeFilesInDirectorySync = summarizeFilesInDirectorySync;
