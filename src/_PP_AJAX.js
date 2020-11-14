/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//===========================AJAX=======================================================================
/*
 все методы в случае ошибки пишут в лог (response,URL,method);
*/
import {log,nlog} from '_PP_LOG'

function Query(URL,method,data){
  let response;
  if (method == 'GET'){
    response = fetch({url: URL,method: 'GET'});
  }else
  if (method == 'POST' || method == 'PUT'){
    response = fetch({
                url: URL,
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
  }
  if (response.status != 200){
    log(response,'response');
  	log(URL,'URL');
	  log(method,'method');
  //  nlog(response.body,'Error');
  //  nlog(response,'Error');
	  return null;
	}
  return  JSON.parse(response.body);
}
export function PATCH(URL,data = null){
	return Query(URL,'PATCH',data);
}
/*
Метод POST в случае неудачи вернёт null
*/
export function POST(URL,data = null){
	return Query(URL,'POST',data);
}
/*
Метод POST в случае неудачи вернёт null в случае успеха body.Result
*/
export function POSTGET(URL,data = null){
	let res =  Query(URL,'POST',data);
  //nlog(res.Result);
  if (res != null){
    return res.Result;
  }
  return null;
}
/*
Метод PUT в случае неудачи вернёт null
*/
export function PUT(URL,data = null){
	return Query(URL,'PUT',data);
}
/*
Метод GET в случае неудачи вернёт null
*/
export function GET(URL){
  let res = Query(URL,'GET',null);
  if(res != null){
    return res.Result;
  }
  return null;
} 


