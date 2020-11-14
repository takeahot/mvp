import * as AJAX from '_PP_AJAX'
import * as LOG from '_PP_LOG'
import * as REST from '_PP_REST'
import {TNote} from '_PP_NOTE'
import {TTask} from '_PP_TASK'
import * as API from '_PP_PROJECT_API'
import {TVisualBlocksV2} from  '_PP_VISUALBLOCKS_V2'
import {TProject} from '_PP_PROJECT_Rew'

function cl (deloInfo,date = context.Date) {

	let LogPId = '3705f919-2f1a-47fe-b829-ac5600f61ead';
	let l = new TProject(LogPId);

	let newBlock = JSON.parse(JSON.stringify(l._VisualBlocksV2.blocks[0].Block[0]));
	let timeLine = newBlock.Lines.filter(el => el.Fields[0].Name === 'Время лога')[0];
	let textLine = newBlock.Lines.filter(el => el.Fields[0].Name === 'Текст лога')[0];
	// LOG.log('timeLine');
	// LOG.log(timeLine);
	// LOG.log('textLine');
	// LOG.log(textLine);
	timeLine.Fields[0].Val = JSON.stringify(date);
	textLine.Fields[0].Val = JSON.stringify(deloInfo);

	newBlock.Lines[0] = timeLine;
	newBlock.Lines[1] = textLine;

	l._VisualBlocksV2.blocks.push(newBlock);
	l.UpdateWithBlocks();

	// let a = {b:'a1',c:'a2'};
	// let d = Object.assign({},a);
	// d.c = 'change';
	// LOG.log('----------------------');
	// LOG.log(a);
}

//get case name from 'претенизия'
let InitProjId = context.ProjectId || '41b89bdb-5bd2-4ce9-9f50-ac53008a842f'
let InitProjJson = API.GetProject(InitProjId)
let name = "Дело по " + InitProjJson.Name;
//get Responsible from 'претензия'
let responsible = {Id: InitProjJson.Responsible.Id};
//set ProjectType
let projectType = {Id: '8d65c940-400d-eb11-90f0-0cc47afb2adf'}

let InitProjInfo = new TProject(InitProjId);
//get 'сумма требований'
let summaPretensii = InitProjInfo._VisualBlocksV2.blocks[0].Lines.reduce((arr,el) => arr = [...arr,...el.Fields],[])
		.filter(el => el.Name === 'Сумма требований')[0].Val

//get 'Предмет спора'
let predmetSpora = InitProjInfo._VisualBlocksV2.blocks[0].Lines.reduce((arr,el) => arr = [...arr,...el.Fields],[])
		.filter(el => el.Name === 'Предмет спора')[0].Val

// create object for case
let delo = new TProject();
//create case in object
delo = delo.Create(name,projectType,responsible);


//set 'сумма требований'
cl(delo._VisualBlocksV2.blocks[1].Lines)
delo._VisualBlocksV2.blocks[1].Lines.reduce((arr,el) => arr = [...arr,...el.Fields],[])
//	.filter(el => el.Name === 'Сумма требований')[0].Val = summaPretensii;

// //set 'Предмет спора
// delo._VisualBlocksV2.blocks[1].Lines.reduce((arr,el) => arr = [...arr,...el.Fields],[])
// 	.filter(el => el.Name === 'Предмет спора')[0].Val = predmetSpora;

// delo.UpdateWithBlocks();

// // LOG.nlog('pass');