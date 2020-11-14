/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
  Обычный консольный лог с выводом названия логирования
*/


export function log(data,caption = null){
  if (caption != null){
    console.log(JSON.stringify(caption));
  }
  console.log(JSON.stringify(data));
}
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
  log(response);
	log(URL);
	log(method);
	//log(data);
  //  nlog(`${method}: ${response.status} URL:${URL}`);
	  return null;
	}
  return  JSON.parse(response.body);
}
function POST(URL,data = null){
	return Query(URL,'POST',data);
}
/*
Выводит Баллон с сообщением (можно отладить внутри автомата)
*/
export function nlog(Text,type = 'Success'){
  POST('/api/NotifySingleUser/NotifySingleUser',{NotificationUserId:context.UserId,NotificationHeaderText:type,NotificationText:JSON.stringify(Text),NotificationType:type});
}
export function nlogEx(User, Caption, Text, type = 'Success') {
	POST('/api/NotifySingleUser/NotifySingleUser',{NotificationUserId:User,NotificationHeaderText:Caption,NotificationText:JSON.stringify(Text),NotificationType:type});
} 


//only for projects.casepro.pro
/*function cl (deloInfo,date = context.Date) {

	let LogPId = '3705f919-2f1a-47fe-b829-ac5600f61ead';
	let l = new TProject(LogPId);

	var newBlock = Object.assign({},l._VisualBlocksV2.blocks[0].Block[0]);
	var timeLine = newBlock.Lines.filter(el => el.Fields[0].Name === 'Время лога')[0];
	var textLine = newBlock.Lines.filter(el => el.Fields[0].Name === 'Текст лога')[0];
	LOG.log('timeLine');
	LOG.log(timeLine);
	LOG.log('textLine');
	LOG.log(textLine);
	timeLine.Fields[0].Val = JSON.stringify(date);
	textLine.Fields[0].Val = JSON.stringify(deloInfo);

	newBlock.Lines[0] = timeLine;
	newBlock.Lines[1] = textLine;

	l._VisualBlocksV2.blocks.push(newBlock);
	l.UpdateWithBlocks();

}*/

