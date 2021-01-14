var express = require('express');
var router = express.Router();
var path = require('path');

/* GET log page. */
router.post('/', function(req, res, next) {
  console.log(req.body.log);
  res.json('done');
//   res.render('index', { title: 'Express', header: 'Log', message: req.body.toString() });
});

module.exports = router;