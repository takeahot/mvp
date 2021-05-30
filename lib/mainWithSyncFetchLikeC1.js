//make fethc like in C1
const f = require('sync-fetch');
const instruction = require('./APIv57instruction.json');
const fetch = (obj) => {
		let result = f(obj.url,Object.fromEntries(Object.entries(obj).filter(el => el[0] !== 'url')))
		let response = {
			headers: Object.fromEntries(result.headers),
			status: result.status,
			body:JSON.stringify(result.json())
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

	c (o) {
		this.dbg?console.log(o):0;
	}

  convertToTransoport(sourceAPI,targetAPI,data) {
    let targetSchema = [];
    let schemasList = instruction.components.schemas
    let result = {};
    // if not link ot another scheme
    if (instruction.paths[targetAPI.path][targetAPI.method].requestBody.content['application/json'].schema['$ref'][0] !== '#') {
      console.log('Error convertToTransoport');
      console.log('instruction.paths[targetAPI.path][targetAPI.method].requestBody.content[application/json].schema[$ref][0] is not #')
      return;
    }
  // assign link ot shcheme in 'porperties.$ref'
    let sourceInitialSchema = 
      instruction
      .paths
      [sourceAPI.path]
      [sourceAPI.method]
      .responses
      ['200']
      .content
      ['application/json']
      .schema
      ['$ref']
      .replace('#/components/schemas/','')
    targetSchema = [
      [
        instruction
          .paths
          [targetAPI.path]
          [targetAPI.method]
          .requestBody
          .content
          ['application/json']
          .schema
          ['$ref']
          .replace('#/components/schemas/',''),
          ''
      ]
    ]
    //make array this properties of scheme
    let arrayForFindSchema = Object.entries(schemasList[targetSchema[0][0]].properties);
    //add parent ot each element in array for search
    arrayForFindSchema.forEach(e => e.push(''));
    //loop until array is 
    while(arrayForFindSchema.length >= 1) {
      //show array
      console.log(arrayForFindSchema,'while'+arrayForFindSchema.length);
      //loop for array elements 
      arrayForFindSchema = arrayForFindSchema.reduce(
        (acc,el) => {
          console.log(el);
          console.log(result);
          //if property have a $ref and property not array 
          // console.log(schemasList[schemasList[sourceInitialSchema].properties.Result['$ref'].replace('#/components/schemas/','')]);
          // console.log((el[2]+el[0]).split('/').reduce((cur,elem) => cur[elem],data));
          console.log((el[2]+el[0]).split('/').reduce(
              (cur,elem) =>  {
                console.log(cur);
                return schemasList[cur.properties[elem]['$ref'].replace('#/components/schemas/','')]
              } ,
              schemasList[schemasList[sourceInitialSchema].properties.Result['$ref'].replace('#/components/schemas/','')]
            )
          )
          if (
            (el[2]+el[0]).split('/').reduce((cur,elem) => cur[elem],data) !== undefined 
            && (el[2]+el[0]).split('/').reduce(
              (cur,elem) =>  schemasList[cur.properties[elem]['$ref'].replace('#/components/schemas/','')] ,schemasList[schemasList[sourceInitialSchema].properties.Result['$ref'].replace('#/components/schemas/','')]
            ) !== undefined
          ) {
            if (el[1]['$ref'] !== undefined) {

              console.log(el[0]);
              console.log('once element');

              //add to targetSchema schema names and place in schema example '#/IntakeForm'
              targetSchema.push([el[1]['$ref'].replace('#/components/schemas/',''),el[2]+el[0]+'/']);
              //check is schema with porperties 
              let contentOfScheme;
              console.log(el[1]['$ref'].replace('#/components/schemas/',''));
              if (schemasList[el[1]['$ref'].replace('#/components/schemas/','')].properties === undefined) {
                contentOfScheme = schemasList[el[1]['$ref'].replace('#/components/schemas/','')];
              } else {
                contentOfScheme = schemasList[el[1]['$ref'].replace('#/components/schemas/','')].properties;
              }
              //collect element from $ref to array for search
              let addToArrayForFindSchema = Object.entries(contentOfScheme);
              //add to each collect element parent data
              addToArrayForFindSchema.forEach(e => e.push(el[2]+el[0]+'/'));
              //add to array for search collected data
              acc = acc.concat(addToArrayForFindSchema);
            //if porperty array and items is $ref
            } else if (el[1].type === 'array') {
              //if array items not $ref
              if (el[1].items['$ref'] === undefined) {
                console.log('convertToTransport not find $ref in array');
              //if array items is $ref
              } else {

                console.log(el[0]);
                console.log('array element');

                //add to targetSchema schema names and place in schema example '#/Blocks/__arr__'
                targetSchema.push([el[1].items['$ref'].replace('#/components/schemas/',''),el[2]+el[0] + "/__arr__"+'/'])
                //check is schema with porperties 
                let contentOfScheme;
                if (schemasList[el[1].items['$ref'].replace('#/components/schemas/','')].properties === undefined) {
                  contentOfScheme = schemasList[el[1].items['$ref'].replace('#/components/schemas/','')];
                } else {
                  contentOfScheme = schemasList[el[1].items['$ref'].replace('#/components/schemas/','')].properties;
                }
                //collect element from $ref to array for search
                let addToArrayForFindSchema = Object.entries(contentOfScheme);
                //add to each collect element parent data
                addToArrayForFindSchema.forEach(e => e.push(el[2]+el[0] + "/__arr__"+'/'));
                //add to array for search collected data
                acc = acc.concat(addToArrayForFindSchema);
              } 
            } else {
              let resultEl = (el[2]+el[0]).split('/').reduce((cur,elem) => cur[elem],data);
              let preLastElem = (el[2]+el[0]).split('/').slice(0,-1).reduce((cur,elem) => cur[elem] = {},result);
              preLastElem[(el[2]+el[0]).split('/').pop()] = resultEl
            }
          }
          return acc;
        },
        []
      )

    }
    console.log('targetShema');
    console.log(targetSchema);
    // }
    // let targetAPISchemas = [];

    console.log(instruction.paths[targetAPI.path][targetAPI.method].requestBody.content['application/json'].schema['$ref']);
    let getScheme = instruction.paths[targetAPI.path][targetAPI.method].requestBody.content['application/json'].schema['$ref']
      .replace('#/','')
      .split('/')
      .reduce((el,pathsPart) => el = el[pathsPart], JSON.parse(JSON.stringify(instruction)));
    console.log(getScheme);
    
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
		this.getValidToken();
	}

	//get token first time
	getToken() {
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
		let request_time = new Date().getTime();
		Object.assign(this,JSON.parse(fetch(o).body),{request_time: request_time});
		return this;
	}

	//refresh invalid token 
	refreshToken () {
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
				refresh_token: this.refresh_token
			})
		}
		let request_time = new Date().getTime();
		Object.assign(this,JSON.parse(fetch(o).body),{request_time: request_time});
		return this;
	}

	getValidToken() {
		if (this.access_token) {
			if (this.expires_in*1000 < (new Date().getTime() - this.request_time)) {
				this.refreshToken();
			}
		} else {
			this.getToken();
		}
		return this;
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
function getCookie(url,user,pass) {
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

/**
 * handle intakeForms
 * 
 *	@param {string} token - token object for handle athorization and get url
 */
class Requests {
	constructor(token) {
		this.token = token;
	}

	intakeForms = [];

	getListReq() {
		let page = 0;
		let result = [];
		let fetch_result = {body:{Count: 0, PageSize: 0}};
		while (fetch_result.body.Count === fetch_result.body.PageSize) {
			let o = {
				url: `https://${this.token.url}.case.one/api/IntakeObjects/Find?api-version=56`,
				method: 'POST',
				headers: {
					'Accept': "application/json, text/plain, */*",
					'Content-Type': 'application/json',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
					'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7',
					'Authorization': this.token.token_type + " " + this.token.access_token
				},
				body: JSON.stringify({
					Page: page++,
					PageSize: '50'
				})
			}
			fetch_result = fetch(o);
			result = [...result,...fetch_result.body.Result];
		}
		return result;
	}

	getReq(id) {
		let o = {
			url: `https://${this.token.url}.case.one//api/IntakeObjects/Get?Id=${id}&api-version=56`,
			method: 'GET',
			headers: {
				'Accept': "application/json, text/plain, */*",
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
				'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7',
				'Authorization': this.token.token_type + " " + this.token.access_token
			}
		}			
		return fetch(o);
	}

	makeModernReq (req) {
		let modernBlocks = req.Result.Blocks.map(
			block => {
					let visualBlock = req.Result.MetadataOfBlocks.find(metadataOfBlocks => block.VisualBlockId === metadataOfBlocks.Id);
					return Object.assign(
							{},
							block,
							{
									VisualBlock: visualBlock,
									Lines: block.Lines.map(
											line => {
													let metaLine = visualBlock.Lines.find(metaLine => line.BlockLineId === metaLine.Id); 
													return Object.assign(
															{},
															line,
															{
																	MetaLine: metaLine,
																	Values: line.Values.map(
																			value => {
																					let field = metaLine.Fields.find(field => value.VisualBlockProjectFieldId === field.Id);
																					return Object.assign(
																							{},
																							value,
																							{
																									Field: field
																							}
																					)
																			}
																	)
															}
													)
											}
									)
							}
					)
			}
		)
		return Object.assign({},req,{Result: Object.assign({},req.Result,{Blocks: modernBlocks})});
	}

	findIntakeFormByName(name) {
		let page = 0;
		let result = [];
		let fetch_result = {body:JSON.stringify({Count: 0, PageSize: 0})};
		while (JSON.parse(fetch_result.body).Count === JSON.parse(fetch_result.body).PageSize) {
			let o = {
				url: `https://${this.token.url}.case.one/api/IntakeForms/Find?api-version=56`,
				method: 'POST',
				headers: {
					'Accept': "application/json, text/plain, */*",
					'Content-Type': 'application/json',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
					'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7',
					'Authorization': this.token.token_type + " " + this.token.access_token
				},
				body: JSON.stringify({
					Name: name,
					Page: page++,
					PageSize: '50'
				})
			}
			fetch_result = fetch(o);
			result = [...result,...JSON.parse(fetch_result.body).Result];
		}
		if (result.length > 1) {
			result = this.intakeForms.find(item => item.Name === Name);
		} else {
			result = result[0];
		}
		let o = {
			url: `https://${this.token.url}.case.one/api/IntakeForms/Get?Id=${result.Id}&api-version=56`,
			method: 'GET',
			headers: {
				'Accept': "application/json, text/plain, */*",
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
				'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7',
				'Authorization': this.token.token_type + " " + this.token.access_token
			}
		}
		result = fetch_result = JSON.parse(fetch(o).body);
		return result;
	}

	sendReq(modReq) {
		let o = {
			url: `https://${this.token.url}.case.one/api/ClientIntakeObjects/Send?api-version=56`,
			method: 'POST',
			headers: {
				'Accept': "application/json, text/plain, */*",
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
				'Accept-Language': 'ru,en-US;q=0.9,en;q=0.8,uk;q=0.7',
				'Authorization': this.token.token_type + " " + this.token.access_token
			},
			body: JSON.stringify({
				"IntakeForm": {
						"Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
						"Name": "string"
				},
				"ShortDescription": "string",
				"Blocks": [
						{
								"Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
								"VisualBlockId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
								"Lines": [
										{
												"Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
												"BlockLineId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
												"Order": 0,
												"Values": [
														{
																"Value": {},
																"VisualBlockProjectFieldId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
																"TempId": "string",
																"Comments": {
																		"List": [
																				{
																						"Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
																						"CreationDate": "2021-05-16T18:41:14.258Z",
																						"Author": {
																								"Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
																								"DisplayName": "string",
																								"Email": "string",
																								"Initials": "string",
																								"FileAvatarId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
																								"Post": "string"
																						},
																						"Text": "string",
																						"Reaction": {
																								"Type": "Like",
																								"Count": 0,
																								"UserHasReacted": true
																						},
																						"Reactions": [
																								{
																										"Type": "Like",
																										"Count": 0,
																										"UserHasReacted": true
																								}
																						],
																						"Attachments": [
																								{
																										"Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
																										"StorageFileId": "string",
																										"Name": "string",
																										"FileSize": 0,
																										"Extension": "string"
																								}
																						]
																				}
																		],
																		"NextPageExists": true,
																		"TotalCount": 0
																}
														}
												]
										}
								],
								"TempId": "string"
						}
				],
				"Images": [
						{
								"FileMetadataId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
								"Name": "string",
								"Description": "string",
								"Width": 0,
								"Height": 0,
								"Order": 0
						}
				]
			})
		}
		fetch_result = fetch(o);

	}
}

module.exports.Token = Token;
module.exports.S = S;
module.exports.Requests = Requests;