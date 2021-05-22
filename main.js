require('dotenv').config();
var VSSB = require('./lib/main.js') 
 // copy from d1 to d1
let fD1toD1 = async (templateId) => {
  console.log('Start copy template ' + templateId + ' from ' + process.env.DURL + ' to ' + process.env.DURL1 + '.', 'fD1toD1');
  let auth = new VSSB.DocAuth(process.env.DURL,process.env.DLOGIN,process.env.DPASSWORD);
  let template = new VSSB.Template(auth)
  Data = await template.getTemplateById(templateId);
  let auth2 = new VSSB.DocAuth(process.env.DURL1,process.env.DLOGIN1,process.env.DPASSWORD1)
  let template2 = new VSSB.Template(auth2)
  let result = await template2.setTemplateFromData(Data);
}
JSON.parse(process.env.DTEMPLATELIST).map(id => fD1toD1(id));
      // res.locals.header = "Результаты авторизации";
      // res.locals.message = runIq
      // res.render('index',res.locals);

//get list of bots from form.one
// const fetch = require('node-fetch');
// listOfBots = async () => {
//   let context = {};
//   obj = {
//       url: 'https://aem.form.one/web/user/login',
//       method: 'POST',
//       headers:{
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//           "email":"a.arestov@pravo.tech",
//           "password":"PrAnAM67"
//           })
//   }
//   context.login = await fetch(obj.url, {method: obj.method, headers: obj.headers, body: obj.body});
//   console.log(await context.login,'cookie');
//   let cookie = context.login.headers.get('set-cookie');
//   obj = {
//       urj: 'https://aem.form.one/web/template/1/bots?page=1',
//       method: 'GET',
//       headers: {
//         "cookie" : cookie
//       }
//   }
//   context.list = await fetch(obj.url,{method: obj.method, headers: obj.headers});
//   console.log((await context.list.json()).items.reduce((acc,val) => acc + val.title + '\r\n',""),'list');
//   context.result = 
  
// }
// listOfBots()