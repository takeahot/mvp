require('dotenv').config();
var VSSB = require('./lib/main.js') 
 // copy from d1 to d1
let fD1toD1 = async () => {
  let auth = new VSSB.DocAuth(process.env.DURL,process.env.DLOGIN,process.env.DPASSWORD);
  let template = new VSSB.Template(auth)
  Data = await template.getTemplateById("4673c098-75fd-11eb-9113-027b580c882d");
  let auth2 = new VSSB.DocAuth(process.env.DURL2,process.env.DLOGIN2,process.env.DPASSWORD2)
  let template2 = new VSSB.Template(auth2)
  let result = await template2.setTemplateFromData(Data);
}
fD1toD1()
