var port = process.env.PORT || 7878;
var parser = require('body-parser');
var express = require('express');
var _ = require('lodash');
var app = express();
var router = express.Router();
var tigers = [
  {
    id: 1,
    name: 'Tigris'
  },
  {
    id: 2,
    name: 'Phantom'
  }
];


// only parse json req.body, use urlencoded to parse html form
app.use(parser.json());

router.get('/', function(req, res) {
    return res.json({ message: 'hello world' });
  });

router.route('/tigers')
  .get(function(req, res) {
    return res.json(tigers);
  })
  .post(function(req, res) {
    var id = getNextId();
    var tiger = {
      id: id,
      name: req.body.name
    }

    tigers.push(tiger);
    return res.json(tigers);
  });

router.route('/tigers/:id')
  .get(function(req, res) {
    var id = parseInt(req.params.id);
    var tiger = _.find(tigers, { id: id });
    return res.json(tiger);
  })
  .put(function(req, res) {
    var id = parseInt(req.params.id);
    var tiger = _.find(tigers, { id: id });
    tiger.name = req.body.name;
    return res.json(tiger);
  })
  .delete(function(req, res) {
    var id = parseInt(req.params.id);
    var result = _.find(_.remove(tigers, { id: id }), { id: id });

    if (!result) {
      return res.status(404).json({
        message: ['Something wrong when deleting a tiger with id', id].join(' ')
      });
    }

    return res.json({
      message: ['Tiger with id ', id, 'successfully deleted'].join(' ')
    });
  });


// prefix all the routes with /api
app.use('/api', router);
app.listen(port);

module.exports = app;

console.log('Server started at port ' + port);

function getNextId() {
  var maxId = _.max(tigers, function(tiger) {
    return tiger.id;
  }).id;
  
  return maxId + 1;
}
