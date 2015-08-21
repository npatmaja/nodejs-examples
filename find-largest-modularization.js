/**
 * Example taken from
 * https://strongloop.com/strongblog/node-js-callback-hell-promises-generators/
 *
 * Problem: Create a module that finds the largest file within a directory
 */
var fs = require('fs');
var path = require('path');

module.exports = function(dir, cb) {
  fs.readdir(dir, function(er, files) { // [1]
    if (er) return cb(er);
    var paths = files.map(function(file) {
      return path.join(dir, file);
    });

    getStats(paths, function(er, stats) {
      if (er) return cb(er);
      var largestFile = getLargestFile(files, stats);
      cb(null, largestFile);
    });
  });
};

function getStats(paths, cb) {
  var counter = paths.length;
  var stats = [];
  paths.forEach(function(path, index) {
    fs.stat(path, populateStat(stats, counter, cb));
  });
}

function getLargestFile(files, stats) {
  var largest = stats.filter(filterFile).reduce(getBiggerFile);
  return files[stats.indexOf(largest)];
}

function populateStat(stats, counter, cb) {
  return function(err, stat) {
    if (err) return cb(err);
    stats.push(stat);
    if (stats.length === counter) cb(null, stats);
  };
}

function filterFile(stat) {
  return stat.isFile();
}

function getBiggerFile(prev, current) {
  if (prev.size > current.size) return prev;
  return current;
}
