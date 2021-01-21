require('dotenv').config();
var VSSB = require('./lib/main.js') 

let auth = new VSSB.Auth(process.env.URL,process.env.LOGIN,process.env.PASSWORD);
  auth.getToken()
    .then(token => {
      let scripts = new VSSB.Script(auth);
      return scripts.getScriptFrom('Добавление ИМ в бренд');
    })

      // res.locals.header = "Результаты авторизации";
      // res.locals.message = runIq
      // res.render('index',res.locals);

