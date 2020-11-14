

import * as AJAX from '_PP_AJAX'
import * as LOG from '_PP_LOG'
import * as REST from '_PP_REST'
import {TNote} from '_PP_NOTE'
import {TTask} from '_PP_TASK'
import * as API from '_PP_PROJECT_API'
import {TVisualBlocksV2} from  '_PP_VISUALBLOCKS_V2'
import {TProject} from '_PP_PROJECT_Rew'


//function for output log to delo
function cl (deloInfo,date = context.Date) {

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
}



let projectID = context.ProjectId || "41b89bdb-5bd2-4ce9-9f50-ac53008a842f"; // идентификатор дела к которому относится сущность context.EntityId (не обязательный, строка)

let delo = new API.GetProject(projectID);
let deloInfo = new TProject(projectID);

//construct mail 
//mail coordinate
//e-mail from delo 
let eMail = deloInfo._VisualBlocksV2.blocks.filter(el => el.Name === 'Данные из притензии')[0]. // block 'данные из претензии' 
	Lines.reduce((arr,el) => arr = [...arr,...el.Fields],[]).  // array with feild from all lines 
	filter(el => el.Name === 'e-mail собственника')[0].Val; // value from 'e-mail собственника' field
let FIOParticipant =  deloInfo._VisualBlocksV2.blocks.filter(el => el.Name === 'Данные из притензии')[0]. // block 'данные из претензии' 
	Lines.reduce((arr,el) => arr = [...arr,...el.Fields],[]).  // array with feild from all lines 
	filter(el => el.Name === 'ФИО собственника')[0].Val; // value from 'ФИО собственника' field

//mail body
//let bodyMail = "nogi buratini s sousom pis"
let comments = deloInfo._VisualBlocksV2.blocks.filter(el => el.Name === 'Комментарий')[0].Lines[0].Lines;
let lastComment = comments[comments.length - 1].Fields[0].Val;

let bodyMail = "<p>" + FIOParticipant + ", добрый день!</p> <p> В деле " + delo.Name + " появился новый комментарий: " + lastComment + " .</p> <p> Список всех комментариев: </p>";

bodyMail = comments.reduce((text,el) => text + "<p> " + el.Fields[0].Val + "</p>",bodyMail);

let mess = {
	"To": [
		eMail
	],
	"Subject": "Уведомление по делу: "+ delo.Name + ".", // тема письма
	"Text": bodyMail,
	"MimeType": "text/plain"
};

loginAsInitiator();

cl(mess);

let sendEmail = fetch({
	url: '/api/Email/SendWithoutSave',
	method: 'POST',
	headers: {'Content-Type': 'application/json'},
	body: JSON.stringify(mess)
});

//LOG.cl (deloInfo,context.Date)



console.log(JSON.stringify(sendEmail));
