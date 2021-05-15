//make fethc like in C1
const f = require('sync-fetch');
const fetch = (obj) => {
		s.c(obj);
		let result = f(obj.url,Object.fromEntries(Object.entries(obj).filter(el => el[0] !== 'url')))
		let response = {
			headers: Object.fromEntries(result.headers),
			status: result.status,
			body:result.json()
		}
		return response;
}

//param 
const dbg = 1;

/**
 * functions for handle little task. Called SF grom support functions.
 * 
 * @param {boolean} dbg - turn on debug mode for work console.log, mode is on then dbg = 1
 */
class S {
	constructor (dbg) {
		this.dbg = dbg;
	}

	c = (o) => {
		this.dbg?console.log(o):0;
	}
}

const s = new S(dbg);

/** 
 * login to C1 by Atuh API v1
 * 
 * @param {string} url - core part of url between "https://" and ".case.one"
 * @param {string} user - user for login
 * @param {string} pass - password for login
 * @param {object} token - object contain server answer
 * 
 * @returns {string} token for come to system
 */
class Token {
	constructor (url,user,pass,token = "") {
    this.url = url;
    this.user = user;
    this.pass = pass;
		this.tokenObj = token||this.getValidToken();
	}

	//get token first time
	getToken = () => {
		let o = {
			url: `https://${this.url}.case.one/api/v1/auth/token`,
			method: 'POST',
			headers: {
				'Accept': "application/json, text/plain, */*",
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
				'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7'
			},
			body: JSON.stringify({
				grant_type: "password",
				username: this.user,
				password: this.pass
			})
		}	
		s.c(o,'getToken');
		let request_time = new Date().getTime();
		this.tokenObj = Object.assign({},fetch(o).body,{request_time: request_time});
		return this.tokenObj;
	}

	//refresh invalid token 
	refreshToken = () => {
		let o = {
			url: `https://${this.url}.case.one/api/v1/auth/token`,
			method: 'POST',
			headers: {
				'Accept': "application/json, text/plain, */*",
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
				'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7'
			},
			body: JSON.stringify({
				grant_type: 'refresh_token',
				refresh_token: this.tokenObj.refresh_token
			})
		}
		s.c(o);
		let request_time = new Date().getTime();
		this.tokenObj = Object.assign(fetch(o).body,{request_time: request_time});
		return this.tokenObj;
	}

	getValidToken = () => {
		if (this.tokenObj) {
			if (this.tokenObj.expires_in*1000 < (new Date().getTime() - this.tokenObj.request_time)) {
				this.refreshToken();
			}
		} else {
			this.getToken();
		}
		return this.tokenObj;
	}

	get token () {
		return this.getValidToken().access_token;
	}
}

/**
 * login to C1 by cookie
 * 
 * @param {string} url - core part of url for login
 * @param {string} user - user for login
 * @param {string} password - password for login
 * 
 * @return {string} - cookie 
 * 
*/
const getCookie = (url,user,pass) => {
  o = {
    url: `https://${url}.case.one/authentication/account/login`,
    method: 'POST',
    headers: {
      'Accept': "application/json, text/plain, */*",
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
      'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7'
   },
    body: JSON.stringify({
      login: user,
      password: pass
    })
  }
  dbgc(o);
  return fetch(o).headers['set-cookie'];
}

module.exports.Token = Token;
module.exports.S = S;