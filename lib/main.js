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
const { resolve } = require('path');

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
  typesOfScript = [
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
    console.log(path.resolve(`./caseone_script/${folder}`));
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
      "Type": fileData.Type
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
      .then (data => {
        // let req = {};
        // req.Name = data.Result.Name;
        // req.Id = data.Result.Id;
        // req.Scheme = fileData.Scheme;
        // req.Description = 'труляля';
        // req.isActive = true;
        let req = fileData;
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
      .then (data => data);
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
