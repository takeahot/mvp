/**
 * not working now
 * porblem with create block in WF (becouse id porblem or body contents. need research)
 * 
 */


// for copy template from D2 to D1
//require(fromD1toD1); // don't check works it

//get list of bots from form.one
/*const fetch = require('node-fetch');
listOfBots = async () => {
  let context = {};
  obj = {
      url: 'https://aem.form.one/web/user/login',
      method: 'POST',
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "email":"a.arestov@pravo.tech",
          "password":"PrAnAM67"
          })
  }
  context.login = await fetch(obj.url, {method: obj.method, headers: obj.headers, body: obj.body});
  console.log(await context.login,'cookie');
  let cookie = context.login.headers.get('set-cookie');
  obj = {
      url: 'https://aem.form.one/web/template/1/bots?page=1',
      method: 'GET',
      headers: {
        "cookie" : cookie
      }
  }
  context.list = await fetch(obj.url,{method: obj.method, headers: obj.headers});
  console.log((await context.list.json()).items.reduce((acc,val) => acc + val.title + '\r\n\r\n',""),'list');
  // cookie = 'amplitude_id_362ba0e7f3ab4fe73bf6bfae1322891eaem.form.one=eyJkZXZpY2VJZCI6IjY5OWRiNmIzLWNjZWEtNDZkNy04MDEzLWVkN2IxZTE0NWY5N1IiLCJ1c2VySWQiOiJhLmFyZXN0b3ZAcHJhdm8udGVjaCIsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTYxMzQxNDIxNDE0NSwibGFzdEV2ZW50VGltZSI6MTYxMzQxNDIxNDE1MiwiZXZlbnRJZCI6NiwiaWRlbnRpZnlJZCI6MTQsInNlcXVlbmNlTnVtYmVyIjoyMH0=; io=aBtYUgyRTUOBUAa2Ao44; laravel_session=eyJpdiI6IkJHa0tEdDVvWGJvdUV6M0ZkY25kR3c9PSIsInZhbHVlIjoiODhNK0lGSTJXNDRwS2FqMlhhUVdWWTZIXC9pM1wvT2JEMUFFZCswb05Jb3Y5bHBFeE10MnNodThQcHJQSWtMWFJpIiwibWFjIjoiNjgxODEzMmNiNzg2ZDhmNGRmZTA3NmI5NzhkZmVlNWEzOTFkNmFhMGYwYjdlMDQxYzBmOGM5YjVjYjcxYjA5YyJ9; laravel_session=eyJpdiI6Ijc5Y0EzUHVZM0R3Y1VsR1FVbHBjc0E9PSIsInZhbHVlIjoiZm05QVwvTWdack1UV2pSWmJEb0praHRkTkhwdFN6UThNS1gyZGp3QnRTY1hDT2NJZlB4cnZYKzNSeml0VXdDUlkiLCJtYWMiOiJhMmNmYjU2ZmIwNGY1YjljNGZkOGY5NmM4OWVjYmI3ZDZlMjY5NmNlN2RkNjRlMWZjN2EwZGRhN2I1YTdlZjJiIn0%3D'
  let body = {
    // "cid": "8df9f961-08c7-4ce7-b8cb-e1367c8cfbeb",
    "title": "рррр",
    // "created": "2021-02-15T19:56:37.023Z",
    "variables": {
        "global": [],
        "webhook": []
    },
    "link": "",
    "activities": [
        {
            "cid": "00000000-0000-0000-0000-000000000000",
            "created": "2021-02-15T20:56:34.389Z",
            "type": "script",
            "title": "",
            "content": "allVar = Object.getOwnPropertyNames(context);\r\nallVar.filter(name => /^newcomp/gi.test(name));\r\ncontext.newcompVar = allVar.join(',');"
        }
    ],
    "body": [
        "00000000-0000-0000-0000-000000000000"
    ]
};



  body = JSON.stringify(body);
  console.log(body.length,"length");
  obj = {
    url: 'https://aem.form.one/web/template/1/bot',
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Cookie" : cookie
    },
    body: body
 }    
/* {
      // "cid": "0471bd6c-b132-46af-a624-ef24bc833827",
      "Title": "test1",
      // "created": "2021-02-15T14:30:42.893Z",
      "variables": {
          "global": [],
          "webhook": []
      },
      "link": "",
      "activities": [
          {
              // "cid": "67186172-7da6-40e1-9607-3948bc275b7e",
              // "created": "2021-02-15T14:30:42.892Z",
              "type": "message",
              "messages": [
                  {
                      "type": "text",
                      "value": "Добро пожаловать!"
                  }
              ]
          }
      ],
      // "body": [
      //     "67186172-7da6-40e1-9607-3948bc275b7e"
      // ]
    }*/
 
/*  context.addBot = await fetch(obj.url,{method: obj.method, headers: obj.headers, body: obj.body});
  console.log(await context.addBot.json(),'addBot');
}

async function getCookie(url,login,pass) {
  obj = {
      url: url + '/web/user/login',
      method: 'POST',
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "email":login,
          "password":pass
          })
  }
  login = await fetch(obj.url, {method: obj.method, headers: obj.headers, body: obj.body});
  let cookie = await login.headers.get('set-cookie');
  return cookie
}

async function checkNew(url,cookie,inn) {
  obj = {
    url: url + '/web/template/1/keywords',
    method: 'GET',
    headers: {
      "Cookie" : cookie
    },
 }    
  keywords = await fetch(obj.url,{method: obj.method, headers: obj.headers});
  keywords = await keywords.json();
  stopProc = keywords.items.map(val => val.name).filter(name => name === inn);
  if (stopProc.length !== 0) {
    console.log('This INN alrady exists');
  }
  return !stopProc.length;
}

async function createBot(url,cookie,context) {
  allNameVars = Object.getOwnPropertyNames(context);
  allNameVars = allNameVars.filter(name => /^newcomp/gi.test(name))
  allVarsText = allNameVars.reduce((acc,name) => {
    return acc + 'context.' + name.replace(/^newcomp/gi,"")+'OfComp' + " = " + context[name] + ";\r\n";
  },'')
  let body = {
    "title": context.newcompname,
    "variables": {
        "global": [],
        "webhook": []
    },
    "link": "",
    "activities": [
        {
            "cid": "00000000-0000-0000-0000-000000000000",
            "type": "script",
            "title": "",
            "content": allVarsText
        }
    ],
    "body": [
        "00000000-0000-0000-0000-000000000000"
    ]
  };
  body = JSON.stringify(body);
  obj = {
    url: url + '/web/template/1/bot',
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Cookie" : cookie
    },
    body: body
 }    
  addBot = await fetch(obj.url,{method: obj.method, headers: obj.headers, body: obj.body});
  data = await addBot.json();
  return data.id;
}

async function createKeyword(url,cookie,keywords) {
  keywords = keywords.map(async val => {
    let body = {
      'name': val
    };
    body = JSON.stringify(body);
    obj = {
      url: url + '/web/template/1/keyword',
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Cookie" : cookie
      },
      body: body
    }    
    keywordId = await fetch(obj.url,{method: obj.method, headers: obj.headers, body: obj.body});
    keywordId = await keywordId.json();
    console.log(keywordId,'keywordId');
    return keywordId.id;
  })
  keywords = await Promise.all(keywords);
  console.log(keywords,'keywords createkeywosrd');
  return keywords;
}

async function changeKeywordStatus(url,cookie,keywords,botId) {
  console.log(keywords,'keyw');
  keywords = keywords.map(async val => {
    let body = {
      "status": "true",
      "bot_id": botId
    };
    body = JSON.stringify(body);
    obj = {
      url: url + '/web/template/keyword/' + val,
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Cookie" : cookie
      },
      body: body
    }    
    keywordsStatus = await fetch(obj.url,{method: obj.method, headers: obj.headers, body: obj.body});
    return await keywordsStatus.json();
  })
  keywords = await Promise.all(keywords);
  return keywords;
}

async function main() {
  let url = 'https://aem.form.one';
  let context = {
    'comp': 'textcomp',
    'newcompname': 'nemeOfNewComp',
    'newcompinn': 'innOfNewComp'
  };
  let cookie = await getCookie(url,'mirtrudmaynow@gmail.com','4m6UQO4hq1')
  let go = await checkNew(url,cookie,context.newcompinn);
  if (go) {
    let botId = await createBot(url,cookie,context);
    context.nameOfComp = 'nameOfComp11';
    context.innOfComp = 'innOfNewComp';
    console.log(botId,'botId');
    let keywords = await createKeyword(url,cookie,[context.nameOfComp,context.innOfComp]);
    console.log(keywords,'keywords');
    let keywordStatus = await changeKeywordStatus(url,cookie,keywords,botId);
    console.log(keywordStatus);
  } else {
    context.error  = 1;
    context.errorText = 'This INN alrady exists.\r\n ИНН данной компании уже существует';
  }
}
main()
