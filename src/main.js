/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//CONFIGURATION INFO
//url first instance optional
const url1 = 'https://gazpromrtv.ru.case.one/';
//url second instance optional
const url2 = '';
//login first user optional
const u_login1 = 'casepro-ipm@team-pravo.ru';
//login second user optional
const u_login2 = '';
//password firs user optional
const u_pass1 = '2210EGFayD';
//password secon user optional
const u_pass2 = '';

//default Http header
const defHttpHeaders = {'Content-Type': 'application/json'};
//defult Http method
const defMethod = 'POST';

//defult fetch setting
const derFetchObj 

// import lib
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
// const { runInThisContext } = require('vm');

//simple unitlity
const convertToRFC1738 = str => str.replace( /[^a-z\.-]/g, c => '%' + c.charCodeAt(0).toString(16) );
const toUrlEncoded = obj => Object.keys(obj).map(k => convertToRFC1738(k).replace(/\u0020/g,'+') + '=' + convertToRFC1738(obj[k]).replace(/\u0020/g,'+')).join('&');
//class default fatch object
class defFetchObj {
  constructor (method = 'GET',)
}

//class for get authentication on case.one
class Auth {
  constructor(url,login,pass = "") {
    this.url = url;
    this.login = login;
    this.pass = pass;
  }
 

  //method for include pass security
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

  //function return token by login and pass
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

//class for manipulate with groupe cases
class Cases {
  constructor (auth) {
    this.auth = auth;
  }
}

//class for manipulate with one case
class Case {
  constructor (auth,case_obj = undefined) {
    if (!case_obj) {
      Object.assign(this,case_obj);
    }
    this.auth = auth;
  }

  CreateCase = (name = 'Безымянное дело',projType = undefined, resp = undefined) => {

    if (projType) {
      //embryo of projectTypes class
      let fetch_obj = {

      }
    }

    let fetch_obj = {
      method:'post',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      },
      body:JSON.stringify({
        "IsAsync": false,
        "Data": {
          "name": name,
          "projType": projType,
          "resp": resp
        }
      })

    }
    console.log(fetch_obj,'fetch_obj CreateCase');
    return fetch(`${this.auth.url}api/v1/scripts/run?name=CreateCase`, fetch_obj)
    .then (res => res.json())
  }

  fillDataByTag = (obj) => {
    let fetch_obj = {
      method:'post',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      },
      body: obj
    }
    console.log(fetch_obj,'fetch_obj');
    return fetch(`${this.auth.url}api/v1/scripts/run?name=FillDataByTags`, fetch_obj)
    .then (res => res.json())
  }
}

//get Torken for user 
let impAuth = new Auth (url1,u_login,u_pass);
AAuth.getToken()
.then(token => {
    let Cs = new Case(impAuth);
    return Cs.CreateCase("запрос на конкурс 1","Запрос на создание конкурса","Ольга Петрова")
})
.then(case_obj => {
    let c = new Case(AAuth,case_obj.Result);
    let data = JSON.stringify(
          {
            "Data": {
              "Id": c.id,
              "Fields": {
                "fio":"\u0410\u043d\u0442\u043e\u043d",
                "e_mail":"memm@ll.ru",
                "date": "22.02.2222",
                "comp":"\u041f\u044f\u0442\u043d\u0438\u0446\u0430"
              }
            }
          }
        )
    console.log(data,'info send to FillData');
    return c.fillDataByTag(data)
})
.then(res => console.log(res,'from fill data'));
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

