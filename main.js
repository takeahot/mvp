//param
const dbg = 1;

//dependecies
require('dotenv').config();
const m = require('./lib/mainWithSyncFetchLikeC1.js');

//main
const newS = new m.S(dbg);
const c = newS.c.bind(newS);

let sourceToken = new m.Token(process.env.CURL,process.env.CLOGIN,process.env.CPASSWORD);
let targetToken = new m.Token(process.env.CURL2,process.env.CLOGIN2,process.env.CPASSWORD2);

let sourceReq = new m.Requests(sourceToken);

// firstId = sourceReq.getListReq()[0].Id;
let id = '75cb8dfe-8607-4b0b-815c-ac3e006ba608'
let req = JSON.parse(sourceReq.getReq(id).body);
let modernReq = sourceReq.makeModernReq(req);

let targetReq = new m.Requests(targetToken); 
// c(modernReq.Result.Intake);
let iF = targetReq.findIntakeFormByName(modernReq.Result.IntakeForm.Name);

modernReq = modernReq.Result;
modernReq.IntakeForm = {"Id": iF.Result.Id};
c(JSON.stringify(modernReq.IntakeForm));
c('modernReq');
// c(JSON.stringify(iF));
// c(req.Result.Blocks);
// c(req.Result.MetadataOfBlocks);

