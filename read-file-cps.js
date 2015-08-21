var fs = require('fs');

function readFile(filePath, callback) {
  fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data){
  	data = ['Opening ' + filePath, data].join('\n\n');
    return callback(err, data);
  });
}

readFile('hello-world.js', function(err, data){
  if (err) return console.error(err);
  return console.log(data);
});
