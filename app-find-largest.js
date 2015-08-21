var find = require('./find-largest');
var findMod = require('./find-largest-modularization');
var findAsync = require('./find-largest-async');
var findPromise = require('./find-largest-promise');

find(__dirname, function(err, file) {
  if (err) return console.error(err);
  console.log('largest file', file);
});

findMod(__dirname, function(err, file) {
  if (err) return console.error(err);
  console.log('largest file (modularization)', file);
});

findAsync(__dirname, function(err, file) {
  if (err) return console.error(err);
  console.log('largest file (async)', file);
});

findAsync.find2(__dirname, function(err, file) {
  if (err) return console.error(err);
  console.log('largest file (async2)', file);
});

findPromise(__dirname).then(function(filename) {
  console.log('largest file (promise)', filename);
})
.catch(console.error);

findPromise.find2(__dirname).then(function(filename) {
  console.log('largest file (promise2)', filename);
})
.catch(console.error);
