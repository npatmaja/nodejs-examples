var Q = require('q');
var fs = require('fs');
var path = require('path');
var fsStat = Q.denodeify(fs.stat);
var fsReaddir = Q.denodeify(fs.readdir); // [1]

module.exports = function(dir) {
  return fsReaddir(dir)
    .then(function(files) {
      var promises = files.map(function(file) {
        return fsStat(path.join(dir, file));
      });

      return Q.all(promises).then(function(stats) { // [2]
        return [files, stats]; // [3]
      });
    })
    .then(function(data) { // [4]
      var files = data[0];
      var stats = data[1];
      var largest = stats.filter(filterFile).reduce(getBiggerFile);
      return files[stats.indexOf(largest)];
    });
}

module.exports.find2 = function(dir) {
  return fsReaddir(dir)
    .then(getStats(dir))
    .then(getLargestFile());
}

function getStats(dir) {
  return function(files) {
    var promises = files.map(function(file) {
      return fsStat(path.join(dir, file));
    });

    return Q.all(promises).then(function(stats) { // [2]
      return [files, stats]; // [3]
    });
  };
}

function getLargestFile() {
  return function(data) {
    var files = data[0];
    var stats = data[1];
    var largest = stats.filter(filterFile).reduce(getBiggerFile);
    return files[stats.indexOf(largest)];
  }
}

function filterFile(stat) {
  return stat.isFile();
}

function getBiggerFile(prev, current) {
  if (prev.size > current.size) return prev;
  return current;
}
