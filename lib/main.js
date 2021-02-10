//import lib
// import * as AJAX from '_PP_AJAX'
// import * as LOG from '_PP_LOG'
// import * as REST from '_PP_REST'
// import {TNote} from '_PP_NOTE'
// import {TTask} from '_PP_TASK'
// import * as API from '_PP_PROJECT_API'
// import {TVisualBlocksV2} from  '_PP_VISUALBLOCKS_V2'
// import {TProject} from '_PP_PROJECT_Rew'
// import { resolve } from 'path'

const http = require('http');
const readline = require('readline');
const fetch = require('node-fetch');
const { runInThisContext } = require('vm');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const { resolve, basename } = require('path');

/*
 * simple unitlity
 * use for authentification
 * 
 */

//convert string to URI string
const convertToRFC1738 = str => str.replace( /[^a-z\.-]/g, c => '%' + c.charCodeAt(0).toString(16) );
//convert objects data to URI format
const toUrlEncoded = obj => Object.keys(obj).map(k => convertToRFC1738(k).replace(/\u0020/g,'+') + '=' + convertToRFC1738(obj[k]).replace(/\u0020/g,'+')).join('&');

//const wrapFe = 

/**
  * Calss for authentication user to Caseone
  *
  * @this Auth 
  * @param {string} url - url address Caseone instance
  * @param {string} login - login
  * @param {string} pass - password
  */

class Auth {
  /**
   * @constructor Auth
   * 
   * @param {string} url - url address Caseone instance
   * @param {string} login - login
   * @param {string} pass - password
   * @constant {string} token - token from Caseone instance approved atuthentication
  */
  constructor(url,login,pass = "") {
    this.url = url;
    this.login = login;
    this.pass = pass;
  }

  /**
   * Method for heidden input to console
   * 
   * @function
   * 
   * @param {function} query 
   */

  hiddenQuestion = query => new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const stdin = process.openStdin();
    process.stdin.on('data', char => {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.pause();
          break;
        default:
          process.stdout.clearLine();
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(query + Array(rl.line.length + 1).join('*'));
          break;
      }
    });
    rl.question(query, value => {
      rl.history = rl.history.slice(1);
      resolve(value);
    });
  });

  //function for input pass
  inputPass = async () => await this.hiddenQuestion('Enter your password > ');

  _throw = function (message) {
    throw new Error(message);
  }

  getToken = async () => {
    let pass = this.pass || await this.inputPass()      
    let credJSON = {
      "GrantType": 'password',
      "username": this.login,
      "password": pass,
      "RefreshToken": ""
    }
    this.token = await fetch(`${this.url}api/v1/auth/token`,{
      method:'post',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body: toUrlEncoded(credJSON)
    })
    .then(response => response.json())
    .then(json => json.access_token || this._throw("Ошибка аутентификации :" + JSON.stringify(json)))
    .catch(er => {
      console.log(er,'er');
      process.exit();
    })
    return this.token
  }

}

/**
 * 
 * object for authentication to Doc.one
 * 
 * @this DocAuth 
 * @param {string} url - url address Doc.one instance
 * @param {string} login - login
 * @param {string} pass - password
 *
 */
class DocAuth {
  /**
   * @constructor FormAuth
   * 
   * @param {string} url - url address Doc.one instance
   * @param {string} login - login
   * @param {string} pass - password
   * @constant {string} token - token from Doc.one instance approved atuthentication
  */
  constructor(url,login,pass = "") {
    this.url = url;
    this.login = login;
    this.pass = pass;
  }

  getCookie = async () => {
    var myHeaders = {};
    myHeaders["Content-Type"] = "application/json";
    var raw = {
      "email":this.login,
      "password":this.pass || this.inputPass()
    };
    var raw = JSON.stringify(raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    this.cookie = await fetch(this.url + "/web/user/login", requestOptions)
      .then(response => response.headers.raw()['set-cookie'])
      .catch(error => console.log('error', error));
    return this.cookie;
  }

  generateBaseAuth = async () => this.Authorization || (this.Authorization = 'Basic ' + Buffer.from(this.login + ':' + this.pass || await this.inputPass()).toString('base64'));

  /**
   * Method for heidden input to console
   * 
   * @function
   * 
   * @param {function} query 
   */

  hiddenQuestion = query => new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const stdin = process.openStdin();
    process.stdin.on('data', char => {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.pause();
          break;
        default:
          process.stdout.clearLine();
          readline.cursorTo(process.stdout, 0);
          process.stdout.write(query + Array(rl.line.length + 1).join('*'));
          break;
      }
    });
    rl.question(query, value => {
      rl.history = rl.history.slice(1);
      resolve(value);
    });
  });

  //function for input pass
  inputPass = async () => await this.hiddenQuestion('Enter your password > ');

}

class Template {
  constructor(auth) {
    this.auth = auth;
  }

  getTemplateById = async (id = '') => {
    let cookie = this.auth.cookie || await this.auth.getCookie();
    let myHeaders = {
      "Cookie":cookie
    }
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    return fetch(this.auth.url + "/web/template/" + id, requestOptions)
      .then(response => response.text())
      .then(result => JSON.parse(result))
      .catch(error => console.log('error', error));
  }

  setTemplateFromData = async (Data = "") => {
    let cookie = this.auth.cookie || await this.auth.getCookie();
    let myHeaders = {
      "Content-Type":"application/json",
      "Cookie":cookie
    }
    var raw = JSON.stringify({
          "name": Data.name,
          "parent_id": "",
          "entities": "{\"nodes\":{},\"fields\":[],\"conditions\":[],\"questions\":[]}",
          "value": "{\"entityMap\":{},\"blocks\":[{\"key\":\"45alv\",\"parentKey\":\"\",\"text\":\"\",\"type\":\"document\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"3dvpc\",\"parentKey\":\"45alv\",\"text\":\"\",\"type\":\"section\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"width\":21,\"height\":29.7,\"margin\":{\"top\":1.27,\"right\":2.54,\"bottom\":1.27,\"left\":2.54}}},{\"key\":\"a1qef\",\"parentKey\":\"3dvpc\",\"text\":\"\",\"type\":\"header\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"6uff0\",\"parentKey\":\"a1qef\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"f2lho\",\"parentKey\":\"3dvpc\",\"text\":\"\",\"type\":\"content\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"219iv\",\"parentKey\":\"f2lho\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"do5kf\",\"parentKey\":\"3dvpc\",\"text\":\"\",\"type\":\"footer\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"3c6p2\",\"parentKey\":\"do5kf\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}]}",
          "type": "template"
    })
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
    let newTemplate = await fetch(this.auth.url + "/web/template/", requestOptions)
      .then(response => response.text())
      .then(result => JSON.parse(result))
      .catch(error => console.log('error', error));
    Data.id = newTemplate.id;
    raw = {
      'id': Data.id,
      'value': Data.value,
      'name': Data.name,
      'document_name': Data.document_name,
      'download_formats': Data.download_formats,
      'header_settings': Data.header_settings,
      'entities': Data.entities,
      'createSnapshot': true
    }
    delete raw.header_settings.counter_format;
    raw = JSON.stringify(raw);
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw
    };
    console.log(raw,'raw');
    console.log(this.auth.url + "/web/template/" + Data.id,'request');
    return await fetch(this.auth.url + "/web/template/" + Data.id, requestOptions)
      .then(response => response.text())
      .then(result => console.log(JSON.parse(result)))
      .catch(error => console.log('error', error));
  }
}

class Cases {
  constructor (auth) {
    this.auth = auth;
  }
  CreateCase = () => {
    let fetch_obj = {
      method:'post',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      },
      body:`{
        "IsAsync": false,
        "Data": {
          name: "Новое дело"
        }
      }`
      /*'{"Name": "тестовый1",' +
            '"ProjectType": {"Id": "a50974fc-7714-eb11-b827-0050560107dd"},' +
            '"Responsible": {"Id": "6ac0d9c0-cf98-45fe-b9d3-90e2c0a5bc88"}}'
    */}
    console.log(fetch_obj,'fetch_obj CreateCase');
    fetch(`${this.auth.url}api/v1/scripts/run?name=CreateCase`, fetch_obj)
    .then (res => res.json())
    .then (res => console.log(res,'create Case'))
  }
  GetList /*GetAllCases*/ = () => {
    fetch(`${this.auth.url}api/Projects/CreateProject?api-version=53`,{
      method:'post',
      headers:{'Content-Type': 'application/json',
                'Accept': 'application/json'},
      body: '{"Name": "тестовый1",' +
            '"ProjectType": {"Id": "a50974fc-7714-eb11-b827-0050560107dd"},' +
            '"Responsible": {"Id": "6ac0d9c0-cf98-45fe-b9d3-90e2c0a5bc88"}}'
    })
    .then (res => res.json())
  }
}

class Case {
  constructor (auth) {
    this.auth = auth;
  }
}

/**
 * class handle scripts list
 * 
 * @method getList - return all instance script in response obj 
 */
class Scripts {
  constructor (auth) {
    this.auth = auth;
  }

  getList = async () => {
    if(!this.script) {
      this.script = new Script(this.auth);
    }
    return await this.script.getScriptDescription();
  }

  getScripts = async (type = "js") => {
    if(!this.script) {
      this.script = new Script(this.auth);
    }
    return this.getList()
    .then(async data => {
      let promises;
      if (type == 'js') {
        promises = data.Result.map(element => (async (wrappedElement) => await this.script.getScriptById(wrappedElemente.Id))(element));
      }
      else if ('json')
      {
        promises = data.Result.map(element => (async (wrappedElement) => await this.script.getScriptSchemeById(wrappedElement.Id))(element));
      }
      else
      {
        throw {'Description': 'Unknown format in Scripts.getScripts'};
      }     
      return await Promise.all(promises);
    })
  }  
  

  sendScripts = async (type = "js") => {
    if(!this.script) {
      this.script = new Script(this.auth);
    }
    let folder = /:\/\/([^\.]*)/ig.exec(this.auth.url)[1];
    console.log(path.resolve(`./caseone_scripts/${folder}`));
    let fileList = [];
    try {
      fileList = await fs.readdir(`./caseone_scripts/${folder}`);
    }
    catch (err) {
      throw err;
    }
    
    let promises = fileList.map(async (el) => {
      return await this.script.createWithScheme(el.replace(/\.json/ig,""));
    })
    return await Promise.all(promises);
  }

}

/**
 * Class for handle script on caseone
 * 
 * @param {object} auth - object contain api-key for authorization
 * 
 */
class Script {
  constructor (auth) {
    this.auth = auth;
  }
  /**
   * list of all type of caseone scripts
   */
  typesOfScript1 = [
    {
      SysName: 'Default',
      Id: '09cc3b78-73c5-e911-90ee-0cc47afb2adf',
      Name: 'Авто'
    },
    {
      SysName: 'Repeat',
      Id: '0acc3b78-73c5-e911-90ee-0cc47afb2adf',
      Name: 'По расписанию'
    },
    {
      SysName: 'Manual',
      Id: 'a8629985-73c5-e911-90ee-0cc47afb2adf',
      Name: 'Ручной'
    },
    {
      SysName: 'Script',
      Id: 'b9629985-73c5-e911-90ee-0cc47afb2adf',
      Name: 'Скрипт'
    }   
  ]    

  typesOfScript = [
    {
      SysName: 'Default',
      Name: 'Авто'
    },
    {
      SysName: 'Repeat',
      Name: 'По расписанию'
    },
    {
      SysName: 'Manual',
      Name: 'Ручной'
    },
    {
      SysName: 'Script',
      Name: 'Скрипт'
    }   
  ]    


  /**
   * method for create script in caseone 
   * 
   * @function
   * 
   * @param {string} name - name of script
   * @param {number} typeOfScript - type of script 0 is default (Авто) and default if undefined typeOfScript, 1 is Repeat (по расписанию), 2 is Manual (Ручной), 3 is Script (Скрипт) 
   * @return {object} - description of new script
   */
  create = (name,typeOfScript = 0) => {
    /*
    The body from documentation
    `{
      "Id": "string",
      "Name": "string",
      "Description": "string",
      "IsActive": true,
      "Type": ${this.typesOfScript[0]},
      "FolderId": "string"
    }`*/

    let body = {
      "Name": name,               
      "Type": this.typesOfScript[typeOfScript]
    }
    body = JSON.stringify(body);

    return fetch(`${this.auth.url}/api/AutomationScripts/CreateOrUpdate?/api-version=53`,{
      method:'put',
      headers:{'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.token,
                'Accept': 'application/json'},
      body: body
      }) 
      .then (res => res.json())
      .then (data => data)
 
  }


  createWithScheme = async (nameOfFile) => {
    let folder = /:\/\/([^\.]*)/ig.exec(this.auth.url)[1];
    console.log(path.resolve(`./caseone_scripts/${folder}`,'createWithScheme'));
    try
    {
      // await fs.access()
    }
    catch 
    {}

    let fileData = await fs.readFile(`./caseone_scripts/${folder}`+'/'+nameOfFile+".json");
    fileData = JSON.parse(fileData);
    let body = {
      "Name": nameOfFile,               
      "Type": {"Id": "a7a5cec4-7dc5-e911-80c4-ac1f6b17f99d"}
    }
/*fileData.Type.Id.replace(/^.{3}/ig,"111")*/
    body = JSON.stringify(body);
  //  console.log(body,'doby create script in createWithScheme');

    return fetch(`${this.auth.url}/api/AutomationScripts/CreateOrUpdate?/api-version=53`,{
      method:'put',
      headers:{'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.token,
                'Accept': 'application/json'},
      body: body
      }) 
      .then (res => res.json())
      .then (data => {
        // console.log(data,'after create script in createWithScheme');
        let req = fileData;
        delete req.Id;
        req.Scheme = [req.Scheme.filter(el => !el.Childs[0])];
        delete req.Scheme[0].Id;
        req = JSON.stringify(req);
        console.log(req,'req');
        return fetch(`${this.auth.url}/api/AutomationScriptScheme/CreateOrUpdate?/api-version=53`,{
          method:'post',
          headers:{'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.token,
                    'Accept': 'application/json'},
          body: req 
        }) 
      })
      .then (res => res.json())
      .then (data => {
        console.log(data.Errors,'errors');
        return data;
      } );
  }
  

  deleteScript = (fileName) => {

    return fetch(`${this.auth.url}api/AutomationScripts/Delete/${Id}?/api-version=53`,{
      method:'put',
      headers:{'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.token,
                'Accept': 'application/json'},
      body: body
      }) 
      .then (res => res.json())
      .then (data => data)
 
  }

  /**
   * method for create script in caseone 
   *
   * @function
   * 
   * @param {string} fileName - name of script from 'src' folder
   * @param {boolean} rewrite - if script exist then rewrite scritpt or not, 'false' is not (by default) and 'true' is rewrite
   * @returns {object} - description of new script
   */
  sendScript = (fileName,rewrite = false) => {
    let scriptName = fileName.replace(/\..+$/gim,"");
    return this.create(scriptName,3)
    .then(script => {
      if (script.ErrorType){
        return (async function () {return script.Error})();
        throw script.ErrorType;
      } else
      {
        let body = {
          "Id": script.Result.Id,
          "Name": scriptName,
          "Scheme": [],
          "Type": {
              "Id": "b9629985-73c5-e911-90ee-0cc47afb2adf"
          },
          "Script": {
              "Body": fs.readFileSync(path.resolve(__dirname, "../"+fileName),'utf-8')
          }
        }
        
        body = JSON.stringify(body);

        return fetch(`${this.auth.url}api/AutomationScriptScheme/CreateOrUpdate?/api-version=53`,{
          method:'post',
          headers:{'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.token,
                    'Accept': 'application/json'},
          body: body
          }) 
          .then (res => res.json())
          .then (data => data)
          .catch (error => {
            if (!rewrite) {
              throw error;
            }
          })
          .then()
          .catch ((er) => 'not rewrite')
      }
    }
    )      
  }

  /**
   * get script from caseone and write to file in VS Code project 
   *
   * @function
   * 
   * @param {string} nameOfScript - name scritp from caseone for crate file in VS code project
   *
   * @returns {string} - 'ok' or 'not ok'
   */
  getScriptByName = (nameOfScript = "") => {
    if(!this.scripts) {
      this.scripts = new Scripts(this.auth);
    }
    this.scripts.getList(nameOfScript) 
    .then(data => this.getScriptById(data.Result[0].Id))
  }


  getScriptSchemeById = async (id = "") => {
    return await fetch(`${this.auth.url}api/AutomationScriptScheme/Get?Id=${id}&api-version=53`,{
      method:'get',
      headers:{'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.token,
                'Accept': 'application/json'},
    })   
    .then (res => res.json())
    .then (data => {
      let scriptData;
      scriptData = {"Description":data.Result.Name, "Scheme":JSON.stringify(data.Result)};
      // console.log(`${this.auth.url}`,'url');
      let folder = /:\/\/([^\.]*)/ig.exec(this.auth.url)[1];
      // console.log(path.resolve(folder));
      console.log(path.resolve(`./caseone_script/${folder}/${scriptData.Description}.json`));
      return (async (data) => {
        let result;
        try {
          result = await fs.access(`./caseone_scripts/${folder}`)
        } catch (err) {
          result = await fs.mkdir(`./caseone_scripts/${folder}`,{recursive: true});
        }
        try {
          await fs.writeFile(`./caseone_scripts/${folder}/${scriptData.Description}.json`,scriptData.Scheme,{flag: 'w'});
          result = 'File write success'
        } catch (err){
          result = 'File write error'
          throw err;
        }
        return result; 
      })()
    })
    .then ((res) => res)
    // .catch ((er) => er);
  }

 getScriptById = async (id = "") => {
    await fetch(`${this.auth.url}api/AutomationScriptScheme/Get?Id=${id}&api-version=53`,{
      method:'get',
      headers:{'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.auth.token,
                'Accept': 'application/json'},
    })   
    .then (res => res.json())
    .then (data => {
      let scriptText = [];
      if (data.Result.Type.SysName == "Script") {
        scriptText[0] = {"Description":data.Result.Name, "Script":data.Result.Script.Body};
        return (async () => await fs.writeFile(`caseone_scripts/${scriptText[0].Description}.js`,scriptText[0].Script))();  
      } else 
      {
        scriptText = data.Result.Scheme.filter(block => block.Type == 'Script' && block.Script.Body !== null).map((block,index) => {
          console.log(data.Result.Scheme,'getScriptById data 2');
          return (async () => await fs.writeFile(`caseone_scripts/${data.Result.Name}_-_${block.Description}.js`,block.Script.Body))();  
        });
      }
    })
    .then ((res) => 'ok')
    .catch ((er) => er);
  }



  getScriptDescription = async (nameOfScript = '') => { 
    let body = 
    {
      "Name":nameOfScript,
      "TypeIds":[], 
      "IsActive":null, 
      "LastEditorIds":[], 
      "StartLastChangeDate":"",
      "EndLastChangeDate":"",
      "FolderId":null,
      "Page":1,
      "PageSize":20
    };
    body = JSON.stringify(body);
    let response;
    do {
      let res = await fetch(`${this.auth.url}api/AutomationScripts/GetAutomationScripts?/api-version=53`,{
        method:'post',
        headers:{'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.auth.token,
                  'Accept': 'application/json'},
        body: body
      })
      .then(res => res.json()) 
      .then(data => {
        if (response) {
          data.Result = response.Result.concat(data.Result);
        }
        response = data
        body = JSON.parse(body)
        body.Page++
        body = JSON.stringify(body);
      })
    }
    while (response.NextPageExists)
    return response       
  }


}



/*
gazprom_mv = {
  u : 'https://gazpromrtv.ru.case.one/',
  l : 'casepro-ipm@team-pravo.ru',
  p : '2210EGFayD'
}

let AAuth = new Auth (gazprom_mv.u,gazprom_mv.l,gazprom_mv.p);
AAuth.getToken()
.then(token => {
  console.log(token,'token');
  console.log(AAuth.token);
  let Cs = new Cases(AAuth);
  Cs.CreateCase();
})
*/
/*
.then(token => {
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log('req');
    res.write(token);
    res.end('Hello World!');
  }).listen(3000);
});
*/

module.exports.Auth = Auth;
module.exports.Scripts = Scripts;
module.exports.Script = Script;
module.exports.DocAuth = DocAuth;
module.exports.Template = Template;

