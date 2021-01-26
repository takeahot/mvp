require('dotenv').config();
var VSSB = require('./lib/main.js') 

let auth = new VSSB.Auth(process.env.URL,process.env.LOGIN,process.env.PASSWORD);
  auth.getToken()
    .then(token => {
      let script = new VSSB.Script(auth);
      return script.createWithScheme('Добавление ИМ в бренд');
    })
    .then(res => console.log(res,'res'));

      // res.locals.header = "Результаты авторизации";
      // res.locals.message = runIq
      // res.render('index',res.locals);

