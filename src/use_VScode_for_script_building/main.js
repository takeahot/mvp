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
      console.log(er);
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
  GetAllCases = () => {
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

module.exports.auth = Auth;
