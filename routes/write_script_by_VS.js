var express = require('express');
var router = express.Router();
var VSSB = require('../src/use_VScode_for_script_building/main.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  iqtech_mv = {
    u : 'https://iqtechnology.casepro.pro/',
    l : 'a.arestov@pravo.tech',
    p : 'PrAn!M67'
  };

  let auth = new VSSB.Auth(iqtech_mv.u,iqtech_mv.l,iqtech_mv.p);
  auth.getToken()
    .then(token => {
      let scripts = new VSSB.Script(auth);
      return scripts.getScriptFrom('Добавление ИМ в бренд');
    })

      // res.locals.header = "Результаты авторизации";
      // res.locals.message = runIq
      // res.render('index',res.locals);

});

module.exports = router;
