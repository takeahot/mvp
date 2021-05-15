//param
const dbg = 1;

//dependecies
require('dotenv').config();
const m = require('./lib/mainWithSyncFetchLikeC1.js');

//main
const c = new m.S(dbg).c;

let sourceToken = new m.Token(process.env.CURL,process.env.CLOGIN,process.env.CPASSWORD);
let targetToken = new m.Token(process.env.CURL2,process.env.CLOGIN2,process.env.CPASSWORD2);

