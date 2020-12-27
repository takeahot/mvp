var express = require('express');
var router = express.Router();
var {Auth} = require('../src/use_VScode_for_script_building/main.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  iqtech_mv = {
    u : 'https://iqtechnology.casepro.pro/',
    l : 'a.arestov@pravo.ru',
    p : 'PrAn!000'
  };

  let runIq = new Auth(iqtech_mv.u,iqtech_mv.l,iqtech_mv.p);
  runIq.getToken()
    .then(token => {

    }
  )


});

module.exports = router;
