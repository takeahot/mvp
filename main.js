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

S.convertToTransoport({path:'/api/IntakeObjects/Get', method: 'get'},{path: '/api/ClientIntakeObjects/Send', method: 'put'},req.Result);

// targetReq.sendReq(sendReqData);
// c(JSON.stringify(modernReq));
// c('modernReq');
// c(JSON.stringify(iF));
// c(req.Result.Blocks);
// c(req.Result.MetadataOfBlocks);

