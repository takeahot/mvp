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

  console.log(VSSB.auth);

  let runIq = new VSSB.auth(iqtech_mv.u,iqtech_mv.l,iqtech_mv.p);
  runIq.getToken()
    .then(token => {
      {
  "Id": "string",
  "Name": "string",
  "Description": "string",
  "IsActive": true,
  "Type": {
    "SysName": "string",
    "Id": "string",
    "Name": "string"
  },
  "FolderId": "string"
}
      console.log('the token is ' + token);

      res.locals.header = "Результаты авторизации";
      res.locals.message = runIq
      res.render('index',res.locals);
    }
  )

});

module.exports = router;
