//param
const dbg = 1;

//dependecies
require('dotenv').config();
const m = require('./lib/mainWithSyncFetchLikeC1.js');

//main
const S = new m.S(dbg);
const c = S.c.bind(S);

let sourceToken = new m.Token(process.env.CURL,process.env.CLOGIN,process.env.CPASSWORD);
let targetToken = new m.Token(process.env.CURL2,process.env.CLOGIN2,process.env.CPASSWORD2);

let sourceReq = new m.Requests(sourceToken);

// firstId = sourceReq.getListReq()[0].Id;
let id = '75cb8dfe-8607-4b0b-815c-ac3e006ba608'
let req = JSON.parse(sourceReq.getReq(id).body);
let modernReq = JSON.parse(JSON.stringify(sourceReq.makeModernReq(req)));

let targetReq = new m.Requests(targetToken); 
//c(modernReq.Result.Intake);
let iF = targetReq.findIntakeFormByName(modernReq.Result.IntakeForm.Name).Result;

sendReqData = {
  "IntakeForm": {
      "Id": iF.Id,
      // "Name": "string"
  },
  // "ShortDescription": "string",
  "Blocks": req.Blocks, 
  "Images": req.Images 
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
//           "email":"",
//           "password":""
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


S.convertToTransoport({path:'/api/IntakeObjects/Get', method: 'get'},{path: '/api/ClientIntakeObjects/Send', method: 'put'},req.Result);

// targetReq.sendReq(sendReqData);
// c(JSON.stringify(modernReq));
// c('modernReq');
// c(JSON.stringify(iF));
// c(req.Result.Blocks);
// c(req.Result.MetadataOfBlocks);



