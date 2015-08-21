var fs = require('fs');
var path = require('path');
var async = require('async');

module.exports = function(dir, cb) {
  async.waterfall([
    function(next) {
      fs.readdir(dir, next); // [1]
    },

    function(files, next) {
      var paths = files.map(function(file) { return path.join(dir, file); });

      async.map(paths, fs.stat, function(er, stats) { // [2]
        next(er, files, stats);
      });
    },

    function(files, stats, next) {
      var largest = stats.filter(filterFile).reduce(getBiggerFile);
      next(null, files[stats.indexOf(largest)]);
    }], cb); // [3]
};

module.exports.find2 = function(dir, cb) {
  async.waterfall([
    getFiles(dir),
    getStats(dir),
    getLargestFile()
  ], cb);
};

function getFiles(dir) {
  return function(next) {
    fs.readdir(dir, next); // [1]
  };
}

function getStats(dir) {
  return function(files, next) {
    var paths = files.map(function(file) { return path.join(dir, file); });

    async.map(paths, fs.stat, function(er, stats) { // [2]
      next(er, files, stats);
    });
  };
}

function getLargestFile() {
  return function(files, stats, next) {
    var largest = stats.filter(filterFile).reduce(getBiggerFile);
    next(null, files[stats.indexOf(largest)]);
  };
}

function filterFile(stat) {
  return stat.isFile();
}

function getBiggerFile(prev, current) {
  if (prev.size > current.size) return prev;
  return current;
}
