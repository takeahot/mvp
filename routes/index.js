var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.use(express.static(__dirname + '/../CoolAdmin-master/'));
router.get('/', function(req, res, next) {
  console.log(path.normalize(path.join(__dirname + '/../CoolAdmin-master/index.html')));
  res.sendFile(path.normalize(path.join(__dirname + '/../CoolAdmin-master/index.html')));
  // res.render('index', { title: 'Express' });
});

module.exports = router;
