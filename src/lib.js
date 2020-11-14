

//{_PP_AJAX}

//===========================AJAX=======================================================================
/*
 все методы в случае ошибки пишут в лог (response,URL,method);
*/
import {log,nlog} from '_PP_LOG'
function Query(URL,method,data){
  let response;
  if (method == 'GET'){
    response = fetch({url: URL,method: 'GET'});
  }else;
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

//{_PP_ARRAY}

import {IsString} from '_PP_IS_'
export function ObjToArray(obj){
	Arr = [];
	for (let key in obj){
    Arr.push(obj[key])
	}
	return Arr;
}
export function fioToFIOArray(fio){
  let s = fio.trim();
  s = s.split(' ');
  let res = []
  s.forEach(item => {
    if(item != ''){
      res.push(item);
    }
  });
  return res;
}
export function ArrayTofio(FIO){
  let fio = '';
  fio = ((FIO[0] === undefined) ? '' : FIO[0])  + ' ' + ((FIO[1] === undefined) ? '' : FIO[1]) + ' ' + ((FIO[2] === undefined) ? '': FIO[2]);
  fio = fio.trim();
  return fio
}
export function FindInArrayObjectsByKeyValue(array,value,key){
  let res = {};
  array.forEach(item => {
     if (item[key] == value){
       res = item;
       return;
     }
  });
  return res;
}
export function FindInArrayObjectsByKeyValueSub(array,value,key){
  let res = {};
  for (let i = 0;i < array.length;i++){
    if(array[i][key] != null && IsString(array[i][key])){
        if (array[i][key].indexOf(value) != -1){
           return array[i];
        }
    }
  }
}
export function FindArrayInArrayObjectsByKeyValue(array,value,key){
  let res = [];
  array.forEach(item => {
     if (item[key] == value){
       res.push(item);
     }
  });
  return res;
}
export function FindIndexInArrayObjectsByKeyValue(array,value,key){
  let res = -1;
  let find = false;
  array.forEach(item => {
     if (!find){
       res++;
     }
     if (item[key] == value){
       find = true;
       return;
     }
  });
  if (find){
    return res;
  }
  return null;
} 

//{_PP_IS_}

export function IsObjectEmpitly(obj){
  if (IsObject(obj)){
    if (obj == null) return true;
    return Object.keys(obj).length == 0
  }
  return true;
}
export function IsObjectNotEmpitly(obj){
  return !IsObjectEmpitly(obj);
}
export function IsStringGUID(val){
  if (IsString(val)){
    let arr = val.split('-');
    if(arr.length == 5 && arr[0].length == 8 && arr[4].length == 12 && arr[1].length == 4 && arr[2].length == 4 && arr[3].length == 4   ){
      return true;
    }
    return false;
  }
  return false;
}
export function IsNotStringGUID(val){
  return !IsStringGUID(val);
}
export function IsUndefined(val){
  return typeof val == 'undefined'
}
export function IsNotUndefined(val){
  return !typeof val == 'undefined'
}
export function IsNumber(val){
  return typeof val == 'number'
}
export function IsNotNumber(val){
  return !typeof val == 'number'
}
export function IsBoolean(val){
  return typeof val == 'boolean'
}
export function IsNotBoolean(val){
  return !typeof val == 'boolean'
}
export function IsString(val){
  return typeof val == 'string'
}
export function IsNotString(val){
  return !typeof val == 'string'
}
export function IsCharNumber(char){
  if (char === '0' ||char === '1' ||char === '2' ||char === '3' ||char === '4' ||char === '5' ||char === '6' ||char === '7' ||char === '8' ||char === '9')return true;
  return false;
}
export function IsInStringNumberOnly(val){
  if (!IsString(val)) return false;
  for (let i = 0;i<val.length;i++){
    if (!IsCharNumber(val[i])){
      return false;
    }
  }
  return true;
}
export function IsObject(val){
  return typeof val == 'object'
}
export function IsNotObject(val){
  return !typeof val == 'object'
}
export function IsFunction(val){
  return typeof val == 'function'
}
export function IsNotFunction(val){
  return !typeof val == 'function'
}
export function IsArray(val){
  if (IsObject(val)){
    return Array.isArray(val)
  }
  return false;
}
export function IsNotArray(val){
  return !IsArray(val);
}
export function IsArrayEmpitly(val){
  if(IsArray(val)){
    if (val.length != 0){
      return false;
    }
  }
  return true;
}
export function IsArrayNotEmpitly(val){
  return !IsArrayEmpitly(val);
} 

//{_PP_LOG}

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
  POST('/api/NotifySingleUser/NotifySingleUser',{NotificationUserId:context.UserId,NotificationHeaderText:type,NotificationText:JSON.stringify(Text),NotificationType:type})
}
export function nlogEx(User, Caption, Text, type = 'Success') {
	POST('/api/NotifySingleUser/NotifySingleUser',{NotificationUserId:User,NotificationHeaderText:Caption,NotificationText:JSON.stringify(Text),NotificationType:type})
} 

//{_PP_NOTE}

import {GET,POST,PUT,POSTGET} from '_PP_AJAX'
import {log} from '_PP_LOG'
export class TNote{
  constructor(ProjectId){
      this.ProjectId = ProjectId;
  }
  Create(data){
    if(data.Project == null){
      data.Project = {Id:this.ProjectId};
    }
    this._POSTCreate(data);
  }
  GetNotes(){
    return this._POSTGetNotes({CaseIds: [this.ProjectId],Page:1,PageSize:100500});
  }
  GetNotesByFilters(CaseIds = null,SearchString = null,Authors = null){
    let data = {};
    data.CaseIds = CaseIds;
    data.SearchString = SearchString;
    data.Authors = Authors;
    data.Page = 1;
    data.PageSize = 100500
    this._POSTGetNotes(data);
  }
  GetAllNotes(){
    return this._POSTGetNotes({Page:1,PageSize:1005000});
  }
  CopyToProject(ProjectId){
    let notes = this._ProjectIdToProjectId(this.GetNotes(),ProjectId);
    notes.forEach(item => {
      this.Create(item);
    });
  }
  _POSTCreate(data){
    POST('/api/Notes/Create',data);
  }
  _POSTGetNotes(data){
    return POSTGET('/api/Notes/GetNotes',data);
  }
  _ProjectIdToProjectId(notes,projectid){
    let res = [];
    notes.forEach((item) => {
      let note = item;
      note.Project = {Id: projectid};
      res.push(note);
    });
    return res;
  }
 /*
  _GetNotes(data){
    let tmp = [];
    let i = 1;
    let dat = data;
    while (1){
      dat.Page = i;
      let res = this._POSTGetNotes(dat);
      i++;
      if (res.length == 0){
        break;
      }
      tmp = tmp.concat(res);
    }
    return tmp;
  }*/
} 

//{_PP_PARCIPIANT_V2}

import {log}  from '_PP_LOG';
import * as API from '_PP_PROJECT_API';
import {fioToFIOArray} from '_PP_ARRAY'
import {sleep} from '_PP_REST'
import {IsArray,IsString,IsStringGUID,IsArrayEmpitly,IsArrayNotEmpitly} from '_PP_IS_'
export class  TParcipiant{
  constructor(id){
  }
  GetAllPeoples(){
    return API.GetIndividuals({"Page":1,"PageSize":100500})
  }
   GetAllPeoplesByFio(LastName = null,FirstName = null,MiddleName = null){
    let dat = {};
    dat.FirstName  = FirstName;
    dat.LastName   = LastName;
    dat.MiddleName = MiddleName;
    dat.Page = 1;
    dat.PageSize =  100500;
    return API.GetIndividuals(dat);
  }
  GetAllOrganizations(){
    return API.GetOrganizations({"Page":1,"PageSize":100500})
  }
  Set(ClientInfo){
    API.PutParticipant(ClientInfo);
  }
  IsPeopleByFIOExists(LastName = null,FirstName = null,MiddleName = null){
    let res = this.GetAllPeoplesByFio(LastName,FirstName,MiddleName);
    if (res != null){
      return !(res.length == 0);
    }else{
      return false;
    }
  }
  IsOrganizationExists(val){
    let dat = {};
    dat.Name = name;
    let res = this.GetOrganization(dat);
    return !(res.length == 0);
  }
  GetOrganization(val){
    let data = {};
    if(IsStringGUID(val)){
       data.Ids = [val];
    }else if(IsString(val)){
        data.Name = val;
    }else if(IsArray(val)){
       data.Ids = val;
    }else {
        return [];
    }
    return API.GetOrganizations(data);
  }
}
class  Participant{
  _GET(val){
    let data = {};
    if(IsStringGUID(val)){
       data.Ids = [val];
    }else if(IsString(val)){
        data.Name = val;
    }else if(IsArray(val)){
       data.Ids = val;
    }else{
      return null;
    }
    return data;
  }
  _TypeId(obj){
    if (obj != null && IsArrayNotEmpitly(obj)){
      let oa = this.GetParticipants(obj[0].Id);
      return  oa[0].TypeId;
    }
  }
  GetParticipants(val){
    let data = this._GET(val)
    if(data != null){
      return API.GetParticipants(data);
    }else{
      return [];
    }
  }
  GetFullParticipants(val){
    let data = this._GET(val)
    if(data != null){
      return API.GetFullParticipants(data);
    }else{
      return [];
    }
  }
  AddParticipantToProject(Id,ProjectId){
    AddParticipantToProject({ParticipantId:Id,ProjectId:ProjectId})
  }
}
class TEmployees {
  constructor(id = null){
    this.Id = id;
    this._Emp = this._GetEmployeesPeople(this.Id);
  }
  _GetEmployeesPeople(id = null){
    let e = this.GetEmployees(id);
    let arr = [];
    e.forEach(item => {
      arr.push(new TPeople(item.Id))
    });
    return arr;
  }
  _GetEmployees(id){
    let res = API.GetEmployees({ParticipantId:id,Page:1,PageSize:100500});
    if (res != null){
      return res;
    }
    return [];
  }
  _RESET(id = null){
    this._Emp = this._GetEmployeesPeople(id);
  }
  GetEmployees(id = null){
    if (this.Id != null && id == null){
      return this._GetEmployees(this.Id);
    }else if (id != null){
      return this._GetEmployees(id);
    }
    return [];
  }
  Employees(index = null){
    this._RESET();
    if (index == null){
      return this._Emp;
    }else if (this._Emp != null){
      return this._Emp[index];
    }
  }
}
export class  TCompany extends Participant{
  constructor(val1 = null,project = null){
    let oa = this.GetAllOrganizations();
    this.TypeId = this._TypeId(oa);
    this.Project = project;
    if(val1 != null){
      let org = this.GetOrganization(val1);
      if (org != null && IsArrayNotEmpitly(org)){
       this.Id = org[0].Id;
       this._Employees = new TEmployees(this.Id);
      }
    }else{
      this._Employees = new TEmployees();
    }
    if(this.Id != null){
      this.FULL = this.GetFullParticipants(this.Id);
    }
  }
  Employees(){
    return this._Employees._Emp;
  }
  GetAllOrganizations(){
    return API.GetOrganizations({"Page":1,"PageSize":100500})
  }
  IsOrganizationExists(val){
    let dat = {};
    dat.Name = name;
    let res = this.GetOrganization(dat);
    return !(res.length == 0);
  }
  Set(ClientInfo = {}){
    let dat = {};
    dat.Type = {"NameEn":"company","Id":this.TypeId};
    dat.VisualBlockValueLines = [];
    Object.assign(dat,ClientInfo);
    dat.IncludeInProjectId =  this.Project;
    let res = API.PutParticipant(dat);
    if (res != null){
      return new TCompany(res.Result.Id,this.Project);
    }
  }
  GetOrganization(val){
    let data = this._GET(val);
    if(data != null){
      return API.GetOrganizations(data);
    }else{
      return [];
    }
  }
  AddPeople(fio = '',ContactDetail = {},ClientInfo = {}){
    let P = new TPeople(null,this.Id,this.Project);
    P.Set(fio,ContactDetail,ClientInfo);
    this._Employees._RESET();
  }
}
export class  TPeople extends Participant{
  constructor(id = null,company = null,project = null){
    let oa = this.GetAllPeoples();
    this.TypeId = this._TypeId(oa);
    this.Id = id;
    this.Company = company;
    this.Project = project;
    if(this.Id != null){
      this.FULL = this.GetFullParticipants(this.Id);
    }
  }
  GetAllPeoples(){
    return API.GetIndividuals({"Page":1,"PageSize":100500})
  }
  Set(fio = '',ContactDetail = {},ClientInfo = {}){
    let AFIO =  fioToFIOArray(fio);
    let dat = {};
    dat.LastName     = (AFIO[0] == null) ? '' : AFIO[0];
    dat.FirstName    = (AFIO[1] == null) ? '' : AFIO[1];
    dat.MiddleName   = (AFIO[2] == null) ? '' : AFIO[2];
    dat.ContactDetail = ContactDetail;
    dat.Type = {"NameEn":"individual","Id":this.TypeId};
    dat.VisualBlockValueLines = [];
    dat.IncludeInProjectId =  this.Project;
    if(this.Company != null){
      dat.Company = {Id:this.Company};
    }
    Object.assign(dat,ClientInfo);
    let res = API.PutParticipant(dat);
    if (res != null){
      return new TPeople(res.Result.Id,this.Company,this.Project)
    }
  }
   GetAllPeoplesByFio(LastName = null,FirstName = null,MiddleName = null){
    let dat = {};
    dat.FirstName  = FirstName;
    dat.LastName   = LastName;
    dat.MiddleName = MiddleName;
    dat.Page = 1;
    dat.PageSize =  100500;
    return API.GetIndividuals(dat);
  }
  IsPeopleByFIOExists(LastName = null,FirstName = null,MiddleName = null){
    let res = this.GetAllPeoplesByFio(LastName,FirstName,MiddleName);
    if (res != null){
      return !(res.length == 0);
    }else{
      return false;
    }
  }
} 

//{_PP_PARCIPIANT}

import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
export class  TParcipiant{
  constructor(id){
  }
  GetAllPeoples(){
    return this._GetPeoples({"Page":1,"PageSize":100500})
  }
   GetAllPeoplesByFio(LastName = null,FirstName = null,MiddleName = null){
    let dat = {};
    dat.FirstName  = FirstName;
    dat.LastName   = LastName;
    dat.MiddleName = MiddleName;
    dat.Page = 1;
    dat.PageSize =  100500;
    return this._GetPeoples(dat);
  }
  GetAllOrganizations(){
    return this._GetOrganizations({"Page":1,"PageSize":100500})
  }
  Set(ClientInfo){
    AJAX.PUT('/api/participants/PutParticipant/',ClientInfo);
  }
  IsPeopleByFIOExists(LastName = null,FirstName = null,MiddleName = null){
    return !(this.GetAllPeoplesByFio(LastName,FirstName,MiddleName).length == 0);
  }
  IsOrganizationExists(val){
    let dat = {};
    dat.Name = name;
    let res = this.GetOrganization(dat);
    return !(res.length == 0);
  }
  GetOrganization(val){
    let data = {};
    if(REST.IsStringGUID(val)){
       data.Ids = [val];
    }else if(REST.IsString(val)){
        data.Name = val;
    }else if(REST.IsArray(val)){
       data.Ids = val;
    }else{
        return [];
    }
    return this._GetOrganizations(data);
  }
  _GetOrganizations(data){
    return AJAX.POSTGET('/api/ParticipantsSuggest/GetOrganizations',data);
  }
  _GetPeoples(data){
    return AJAX.POSTGET('/api/ParticipantsSuggest/GetIndividuals',data);
  }
} 

//{_PP_PROJECT_API}

import * as AJAX from '_PP_AJAX';
///api/Notes/
export function GetNote(Id){
  return AJAX.GET(`/api/Notes/Get/${Id}`);
}
export function DeleteNote(Id){
  AJAX.GET(`/api/Notes/Delete/${Id}`);
}
export function UpdateNote(data){
  AJAX.PUT('/api/Notes/Update/',data);
}
export function CreateNote(data){
  AJAX.POSTGET('/api/Notes/Create',data);
}
export function GetNotes(data){
  AJAX.POSTGET('/api/Notes/GetNotes',data);
}
export function GetAllVisualBlocks(ProjectId){
  return AJAX.GET(`/api/ProjectCustomValues/GetAllVisualBlocks?ProjectId=${ProjectId}`);
}
///api/participants/
export function PutParticipant(data){
  return AJAX.PUT('/api/participants/PutParticipant/',data);
}
///api/ParticipantsSuggest
export function GetOrganizations(data){
  return AJAX.POSTGET('/api/ParticipantsSuggest/GetOrganizations/',data);
}
export function GetIndividuals(data){
  return AJAX.POSTGET('/api/ParticipantsSuggest/GetIndividuals/',data);
}
export function GetParticipants(data){
  return AJAX.POSTGET('/api/ParticipantsSuggest/GetParticipants/',data);
}
export function GetFullParticipants(data){
  return AJAX.POSTGET('/api/ParticipantsSuggest/GetFullParticipants/',data);
}
export function GetEmployees(data){
  return AJAX.POSTGET('/api/Participants/GetEmployees',data);
}
export function GetParticipantProjects(data){
  return AJAX.POSTGET('/api/Participants/GetParticipantProjects',data);
}
export function AddParticipantToProject(data){
  return AJAX.PUT('/api/Participants/AddParticipantToProject',data);
}
///api/Projects/
export function GetUsersAndClients(Id){
  return AJAX.POSTGET('/api/Projects/CreateProject',{ProjectId:Id,"Page":1,"PageSize":100500});
}
export function GetProject(Id){
  return AJAX.GET(`/api/Projects/GetProject/${Id}`);
}
export function  _SetSubscribe(Id){
    AJAX.GET(`/api/Projects/Subscribe?projectId=${Id}`)
}
export function PUTUpdate(data){
  //REST.sleep(5);
  AJAX.PUT('/api/Projects/PutProject',data);
}
export function _PUTUpdate(data){
  //REST.sleep(5);
  AJAX.PUT('/api/Projects/PutProject',data);
}
export function PUTUpdateSummary(data){
  // REST.sleep(5);
  AJAX.PUT('/api/Projects/UpdateProjectSummary',data);
}
export function _PUTUpdateSummary(data){
  // REST.sleep(5);
  AJAX.PUT('/api/Projects/UpdateProjectSummary',data);
}
export function PUTUpdateTab(data){
  AJAX.PUT('/api/Projects/UpdateProjectTab/',data);
}
export function _PUTUpdateTab(data){
  AJAX.PUT('/api/Projects/UpdateProjectTab/',data);
}
export function POSTCreate(data){
    return AJAX.POSTGET('/api/Projects/CreateProject',data);
}
export function _POSTCreate(data){
    return AJAX.POSTGET('/api/Projects/CreateProject',data);
}
export function _ResetSubscribe(Id){
  AJAX.GET(`/api/Projects/Unsubscribe?projectId=${Id}`)
}
export function UpdateWithBlocks(data){
  return AJAX.PUT('/api/Projects/UpdateProjectWithBlocks',data);
}
export function _UpdateWithBlocks(data){
  return AJAX.PUT('/api/Projects/UpdateProjectWithBlocks',data);
}
///api/ProjectTypes
export function GETType(TypeId){
  return AJAX.GET(`/api/ProjectTypes/GetProjectType?projectTypeId=${TypeId}`);
}
export function POSTGetTypes(data){
  return AJAX.POSTGET('/api/ProjectTypes/GetProjectTypes',data);
}
export function _POSTGetTypes(data){
  return AJAX.POSTGET('/api/ProjectTypes/GetProjectTypes',data);
}
///api/ProjectSharedUsersAndGroups
export function SharedUsersAndGroups(Id){
    return AJAX.GET(`/api/ProjectSharedUsersAndGroups/GetProjectSharedUsers?projectId=${Id}`);
}
///api/ProjectGroupSuggest
export function _GetGroupsByFolder(data){
  return AJAX.POSTGET('/api/ProjectGroupSuggest/GetProjectGroupsByFolderSuggest',data);
}
export function _GetGroups(data){
  return AJAX.POSTGET('/api/ProjectGroupSuggest/GetProjectGroups',data);
}
///api/ProjectFolderSuggest
export function _GetFolders(data){
  return AJAX.POSTGET('/api/ProjectFolderSuggest/GetProjectFolders',data);
}
///api/ProjectSettings
export function _GetSettings(Id){
    return AJAX.GET(`/api/ProjectSettings/GetSettings?projectId=${Id}`);
}
export function _SetSettings(data){
    return AJAX.PUT(`/api/ProjectSettings/SaveSettings`,data);
}
///api/RelatedObjects
export function PUTSetRelated(data){
  AJAX.PUT('/api/RelatedObjects/SaveRelatedObjects',data);
}
export function _PUTSetRelated(data){
  AJAX.PUT('/api/RelatedObjects/SaveRelatedObjects',data);
}
export function GETGetRelated(Id){
  return AJAX.GET(`/api/RelatedObjects/GetRelatedObjects/${Id}`);
}
export function _GETGetRelated(Id){
  return AJAX.GET(`/api/RelatedObjects/GetRelatedObjects/${Id}`);
}
///api/CompanyUsersSuggest
export function POSTGetResponsible(data){
  return AJAX.POSTGET('/api/CompanyUsersSuggest/GetUsers',data);
}
export function _POSTGetResponsible(data){
  return AJAX.POSTGET('/api/CompanyUsersSuggest/GetUsers',data);
}
///api/ProjectCopy
export function POSTCopy(data){
    return AJAX.POSTGET('/api/ProjectCopy/Copy',data);
}
export function _POSTCopy(data){
    return AJAX.POSTGET('/api/ProjectCopy/Copy',data);
}
///api/TaskUsersAndGroupsSuggest
export function POSTGetResponsibles(data){
    return AJAX.POSTGET('/api/TaskUsersAndGroupsSuggest/GetTaskUsersAndGroups',data)
}
///api/dictionary
export function POSTGetDictonaryItems(data){
    return AJAX.POSTGET('/api/dictionary/getdictionaryitems',data)
}
///api/NotificationTypesSuggest
export function POSTGetNotificationTypes(data){
    return AJAX.POSTGET('/api/NotificationTypesSuggest/GetNotificationTypes',data)
}
///api/Tasks
export function PUTCreateTask(data){
    return AJAX.PUT('/api/Tasks/PutTask/',data);
}
//
export function POSTGetOpenTask(data){
    return AJAX.POST('/api/Tasks/OpenTask',data)
}
//api/Tasks/GetNotGroupedTasks
export function POSTGetNotGroupedTasks(data){
    return AJAX.POSTGET('/api/Tasks/GetNotGroupedTasks',data);
}
//
export function GETInfo(Id){
    return AJAX.GET(`/api/Tasks/GetTask/?criterion.taskId=${Id}`);
}
export function POSTGetTaskNames(data){
    return AJAX.POSTGET('/api/TaskNames/GetTaskNames',data);
}
export function POSTGETTaskResponsibles(data){
    return AJAX.POSTGET('/api/TaskResponsiblesSuggest/Get',data);
}
export function POSTGETTaskAuthors(data){
    return AJAX.POSTGET('/api/TaskAuthorsSuggest/Get',data);
}
export function GetProjectType(ProjectId){
    return GetProject(ProjectId).ProjectType.Id;
} 

//{_PP_PROJECT_Rew}

import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
import {TNote} from '_PP_NOTE';
import {TTask} from '_PP_TASK';
import * as API from '_PP_PROJECT_API';
//import {TVisualBlocks} from '_PP_VISUALBLOCKS';
import {TVisualBlocksV2} from  '_PP_VISUALBLOCKS_V2'
export class TProject{
    constructor(Id = null){
       this.Id =  Id;
       if (Id != null){
        //this._VisualBlocks = new TVisualBlocks(Id);
        this._VisualBlocksV2 = new TVisualBlocksV2(Id);
        this._Task = new TTask(Id);
       }
    }
    Info(){
        return  API.GetProject(this.Id);
    }
    /*VisualBlocks(){
      return this._VisualBlocks;
    }*/
    VisualBlocks(){
      return this._VisualBlocksV2;
    }
    Task(){
      return this._Task;
    }
    GetLinc(){
      let EntityInfo = this.Info();
      let Value = {};
      Value.Id = EntityInfo.Id;
      Value.Name = EntityInfo.Name;
      Value.ProjectTypeId = EntityInfo.ProjectType.Id;
      Value.DocumentFolderId = EntityInfo.DocumentFolderId;
      Value.DocumentFolderName = EntityInfo.DocumentFolderName;
      Value.Client = EntityInfo.Client;
      Value.IsArchive = EntityInfo.IsArchive;
      return Value;
    }
    GetStages(Name){
      return REST.FindInArrayObjectsByKeyValue(this._VisualBlocks._GETAll().ProjectTypeStages,Name,'Name');
    }
    SetProjectInfo(Client = null,Name = null,Responsible = null,Blocks = [],Images = [],Stage = null){
      let res  = this.Info();
      if (Client != null){
        res.Client      = Client;
      }
      if(Name != null){
        res.Name        = Name;
      }
      if(Responsible != null){
        res.Responsible = Responsible;
      }
      if(Stage != null){
        res.Stage = Stage;
      }
      if (Blocks.length > 0){
        res.Blocks = Blocks;
      }else{
        if (this._VisualBlocks.GetUpdate() == null){
          res.Blocks = [];
        }else{
          res.Blocks = this._VisualBlocks.GetUpdate();
        }
      }
      res.Images = Images;
      API._PUTUpdateSummary(res);
    }
    GetResponsibleByName(Name){
      let res = API._POSTGetResponsible({Name:Name});
     // LOG.nlog(res);
      if (res != null){
        return res[0];
      }
      return null;
    }
    GetFolders(name = null){
      return API._GetFolders({Name:name});
    }
    GetGroups(name = null){
      return API._GetGroups({Name:name});
    }
    GetGroupsByFolder(FolderId,name = null){
      return API._GetGroupsByFolder({FolderId:FolderId,Name:name});
    }
    Create(name,ProjectType = {},Responsible = {},Folder = {},Group = {}){
        LOG.log(Responsible,'res');
        if (!REST.IsObjectEmpitly(ProjectType) && !REST.IsObjectEmpitly(Responsible)){
           LOG.log(ProjectType,'res');
           if(ProjectType.Id != null && ProjectType.Name != null && Responsible.Id != null && Responsible.Name != null ){
              let data = {Name:name,ProjectType:ProjectType,Responsible:Responsible,ProjectFolder:Folder,ProjectGroup:Group}
              let res = API._POSTCreate(data);
              LOG.log(res,'res');
              if (res != null){
                return new TProject(res.Id);
              }
              return null;
           }
        }
    }
    UpdateWithBlocks(){
      let dat = this.Info();
      dat.Images = [];
      dat.Blocks = this._VisualBlocks.GetUpdate();
      return API._UpdateWithBlocks(dat)
    }
    Set(Info){
      API._PUTUpdateSummary(Info);
    }
    Update(Info){
      API._PUTUpdate(Info);
    }
    GetRelated() {
      return API._GETGetRelated(this.Id)
    }
    Subscribe(Set = true){
      if(Set){
        API._SetSubscribe(this.Id)
      }else{
        API._ResetSubscribe(this.Id);
      }
    }
    GetSettings(){
      return API._GetSettings(this.Id);
    }
    SetSettings(data){
      API._SetSettings(data);
    }
    /*
    Принимает на вход Строку ID или массив строк (IDs)
    */
    SetRelated(Related){
      let res = [];
      res = this.GetRelated();
      if(REST.IsArray(Related)){
        Related.forEach(item =>{
          res.push({Id:item,Type:'Project'});
        })
      }else{
        res.push({Id:Related,Type:'Project'});
      }
      API._PUTSetRelated({Id:this.Id,Type: 'ProjectToProjects',RelatedObjects:res})
    }
    Copy(Name = null,ProjectTypeId,EntityTypes = []){
        //if (Name) arestov commented string
        let data = {};
        data.Name = Name;
        data.ProjectTypeId = ProjectTypeId;
        data.CopyEntityTypes =  EntityTypes;
        data.ProjectId = this.Id;
        let res = API._POSTCopy(data)
        if (res != null){
          return new TProject(res);
        }
        return null;
    }
    GetTabIdByName(name){
      let res = null;
      this.GETType().Tabs.forEach(item =>{
        if (item.Name == name){
          res = item.Id;
          return;
        }
      });
      return res;
    }
    GetTypes(Param = null){
      let data = {};
      if(REST.IsStringGUID(Param)){
        data.Ids = [Param];
      }else if (REST.IsString(Param)){
        data.Name = Param;
      }else{
        data = {Page:1,PageSize:100500};
      }
      return API._POSTGetTypes(data);
    }
    TypeId(){
      return this.Info().ProjectType.Id;
    }
    UpdateTab(Tab,Blocks = []){
      let _tab = Tab;
      if(REST.IsNotStringGUID(Tab)){
        _tab = this.GetTabIdByName(Tab);
      }
      LOG.log(_tab,'_tab')
      let data = this.Info();
      data.Images = [];
      data.ProjectTypeTabId = _tab;
      if (Blocks.length > 0){
        data.Blocks = Blocks;
      }else{
        if (this._VisualBlocks.GetUpdate() == null){
          data.Blocks = [];
        }else{
          data.Blocks = this._VisualBlocks.GetUpdate();
        }
      }
      API._PUTUpdateTab(data);
    }
    GetUsersAndClients(){
      return API.GetUsersAndClients(this.Id);
    }
    GETType(){
      return API.GETType(this.TypeId());
    }
    SharedUsersAndGroups(){
      return API.SharedUsersAndGroups(this.Id);
    }
} 

//{_PP_PROJECT}

import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
import {TNote} from '_PP_NOTE';
import {TTask} from '_PP_TASK';
import {TVisualBlocks} from '_PP_VISUALBLOCKS';
//import {TVisualBlocksV2} from '_PP_VISUALBLOCKS_V2';
export class TProject{
    constructor(Id = null){
       this.Id =  Id;
       // LOG.log(this.Id,'this.Id');
       if (Id != null){
        this._VisualBlocks  = new TVisualBlocks(Id);
      //  this._VisualBlocks2 = new TVisualBlocksV2(Id);
       // LOG.log(this._VisualBlocks,'this._VisualBlocks');
        this._Task = new TTask(Id);
       // LOG.log(this._Task,'this._Task');
       }
    }
    Info(){
        return AJAX.GET('/api/Projects/GetProject/' + this.Id);
    }
    VisualBlocks(){
      return this._VisualBlocks;
    }
    Task(){
      return this._Task;
    }
    GetLinc(){
      let EntityInfo = this.Info();
      let Value = {};
      Value.Id = EntityInfo.Id;
      Value.Name = EntityInfo.Name;
      Value.ProjectTypeId = EntityInfo.ProjectType.Id;
      Value.DocumentFolderId = EntityInfo.DocumentFolderId;
      Value.DocumentFolderName = EntityInfo.DocumentFolderName;
      Value.Client = EntityInfo.Client;
      Value.IsArchive = EntityInfo.IsArchive;
      return Value;
    }
    GetStages(Name){
      return REST.FindInArrayObjectsByKeyValue(this._VisualBlocks._GETAll().ProjectTypeStages,Name,'Name');
    }
    SetProjectInfo(Client = null,Name = null,Responsible = null,Blocks = [],Images = [],Stage = null){
      let res  = this.Info();
      if (Client != null){
        res.Client      = Client;
      }
      if(Name != null){
        res.Name        = Name;
      }
      if(Responsible != null){
        res.Responsible = Responsible;
      }
      if(Stage != null){
        res.Stage = Stage;
      }
      if (Blocks.length > 0){
        res.Blocks = Blocks;
      }else{
        if (this._VisualBlocks.GetUpdate() == null){
          res.Blocks = [];
        }else{
          res.Blocks = this._VisualBlocks.GetUpdate();
        }
      }
      res.Images = Images;
      this._PUTUpdateSummary(res);
    }
    GetResponsibleByName(Name){
      let res = this._POSTGetResponsible({Name:Name});
     // LOG.nlog(res);
      if (res != null){
        return res[0];
      }
      return null;
    }
    GetFolders(name = null){
      return this._GetFolders({Name:name});
    }
    GetGroups(name = null){
      return this._GetGroups({Name:name});
    }
    GetGroupsByFolder(FolderId,name = null){
      return this._GetGroupsByFolder({FolderId:FolderId,Name:name});
    }
    _GetGroupsByFolder(data){
      return AJAX.POSTGET('/api/ProjectGroupSuggest/GetProjectGroupsByFolderSuggest',data);
    }
    _GetGroups(data){
      return AJAX.POSTGET('/api/ProjectGroupSuggest/GetProjectGroups',data);
    }
    _GetFolders(data){
      return AJAX.POSTGET('/api/ProjectFolderSuggest/GetProjectFolders',data);
    }
    Create(name,ProjectType = {},Responsible = {},Folder = null,Group = null){
        LOG.log(Responsible,'res');
        if (!REST.IsObjectEmpitly(ProjectType) && !REST.IsObjectEmpitly(Responsible)){
           LOG.log(ProjectType,'res');
           if(ProjectType.Id != null && ProjectType.Name != null && Responsible.Id != null && Responsible.Name != null ){
              let data = {Name:name,ProjectType:ProjectType,Responsible:Responsible,ProjectFolder:Folder,ProjectGroup:Group}
              LOG.log(data,'data');
              let res = this._POSTCreate(data);
              LOG.log(res,'res');
              if (res != null){
                return new TProject(res.Id);
              }
              return null;
           }
        }
    }
    UpdateWithBlocks(){
      let dat = this.Info();
      dat.Images = [];
      dat.Blocks = this._VisualBlocks.GetUpdate();
      return this._UpdateWithBlocks(dat)
    }
    _UpdateWithBlocks(data){
      return AJAX.PUT('/api/Projects/UpdateProjectWithBlocks',data);
    }
    Set(Info){
      this._PUTUpdateSummary(Info);
    }
    Update(Info){
      this._PUTUpdate(Info);
    }
    GetRelated() {
      return this._GETGetRelated()
    }
    Subscribe(Set = true){
      if(Set){
        this._SetSubscribe()
      }else{
        this._ResetSubscribe();
      }
    }
    SharedUsersAndGroups(){
       return AJAX.GET(`/api/ProjectSharedUsersAndGroups/GetProjectSharedUsers?projectId=${this.Id}`);
    }
    GetSettings(){
      return this._GetSettings();
    }
    SetSettings(data){
      this._SetSettings(data);
    }
    GetUsersAndClients(){
      return AJAX.POSTGET('/api/Projects/CreateProject',{ProjectId:this.Id,"Page":1,"PageSize":100500});
    }
    _GetSettings(){
       return AJAX.GET(`/api/ProjectSettings/GetSettings?projectId=${this.Id}`);
    }
    _SetSettings(data){
       return AJAX.PUT(`/api/ProjectSettings/SaveSettings`,data);
    }
     _SetSubscribe(){
       AJAX.GET(`/api/Projects/Subscribe?projectId=${this.Id}`)
     }
     _ResetSubscribe(){
       AJAX.GET(`/api/Projects/Unsubscribe?projectId=${this.Id}`)
     }
    /*
    Принимает на вход Строку ID или массив строк (IDs)
    */
    SetRelated(Related){
      let res = [];
      res = this.GetRelated();
      if(REST.IsArray(Related)){
        Related.forEach(item =>{
          res.push({Id:item,Type:'Project'});
        })
      }else{
        res.push({Id:Related,Type:'Project'});
      }
      this._PUTSetRelated({Id:this.Id,Type: 'ProjectToProjects',RelatedObjects:res})
    }
    Copy(Name = null,ProjectTypeId,EntityTypes = []){
        //if (Name)arestov commented string
        let data = {};
        data.Name = Name;
        data.ProjectTypeId = ProjectTypeId;
        data.CopyEntityTypes =  EntityTypes;
        data.ProjectId = this.Id;
       // LOG.nlog(data.Name);
       // LOG.nlog(data.ProjectTypeId);
       // LOG.nlog(data.CopyEntityTypes);
        LOG.log(data);
        let res = this._POSTCopy(data)
        if (res != null){
          return new TProject(res);
        }
        return null;
    }
    GetTabIdByName(name){
      let res = null;
      this.GETType().Tabs.forEach(item =>{
        if (item.Name == name){
          res = item.Id;
          return;
        }
      });
      return res;
    }
    GETType(){
      return AJAX.GET('/api/ProjectTypes/GetProjectType?projectTypeId=' + this.TypeId());
    }
    GetTypes(Param = null){
      let data = {};
      if(REST.IsStringGUID(Param)){
        data.Ids = [Param];
      }else if (REST.IsString(Param)){
        data.Name = Param;
      }else{
        data = {Page:1,PageSize:100500};
      }
      return this._POSTGetTypes(data);
    }
    _POSTGetTypes(data){
      return AJAX.POSTGET('/api/ProjectTypes/GetProjectTypes',data);
    }
    TypeId(){
      return this.Info().ProjectType.Id;
    }
    UpdateTab(Tab,Blocks = []){
      let _tab = Tab;
      if(REST.IsNotStringGUID(Tab)){
        _tab = this.GetTabIdByName(Tab);
      }
      LOG.log(_tab,'_tab')
      let data = this.Info();
      data.Images = [];
      data.ProjectTypeTabId = _tab;
      if (Blocks.length > 0){
        data.Blocks = Blocks;
      }else{
        if (this._VisualBlocks.GetUpdate() == null){
          data.Blocks = [];
        }else{
          data.Blocks = this._VisualBlocks.GetUpdate();
        }
      }
      this._PUTUpdateTab(data);
    }
    _PUTSetRelated(data){
      AJAX.PUT('/api/RelatedObjects/SaveRelatedObjects',data);
    }
    _POSTGetResponsible(data){
      return AJAX.POSTGET('/api/CompanyUsersSuggest/GetUsers',data);
    }
    _GETGetRelated(data){
      return AJAX.GET(`/api/RelatedObjects/GetRelatedObjects/${this.Id}`);
    }
    _PUTUpdateSummary(data){
      REST.sleep(5);
      AJAX.PUT('/api/Projects/UpdateProjectSummary',data);
    }
    _PUTUpdate(data){
      REST.sleep(5);
      AJAX.PUT('/api/Projects/PutProject',data);
    }
    _PUTUpdateTab(data){
      AJAX.PUT('/api/Projects/UpdateProjectTab/',data);
    }
    _POSTCreate(data){
        return AJAX.POSTGET('/api/Projects/CreateProject',data);
    }
    _POSTCopy(data){
        return AJAX.POSTGET('/api/ProjectCopy/Copy',data);
    }
} 

//{_PP_REST}

import * as LOG from '_PP_LOG'
export function TimeShtampToDateTime(timestamp){
  let date = new Date();
  //nlog(String(timestamp));
  date.setTime(timestamp*1000);
  return date.toISOString();
}
export function GetEmpitlyDate(){
  let date = new Date();
  date.setTime(0);
  return date.toISOString();
}
export function SetZeroTime(val){
  let res = new Date(val);
  res =  res.toISOString().substr(0,11) + '00:00:00.000Z';
  LOG.log(res,'SetZeroTime');
 /* res.setMilliseconds(0);
  res.setSeconds(0);
  res.setMinutes(0);
  res.setHours(0) ;*/
  return res;
}
export function sleep(sec) {
  let t = Date.now();
  let s = sec * 1000;
  let i = 0;
  while ((Date.now() - t) < s) {
      i++;
  }
}
export function ObjToArray(obj){
	Arr = [];
	for (let key in obj){
    Arr.push(obj[key])
	}
	return Arr;
}
export function fioToFIOArray(fio){
  let s = fio.trim();
  s = s.split(' ');
  let res = []
  s.forEach(item => {
    if(item != ''){
      res.push(item);
    }
  });
  return res;
}
export function ArrayTofio(FIO){
  let fio = '';
  fio = ((FIO[0] === undefined) ? '' : FIO[0])  + ' ' + ((FIO[1] === undefined) ? '' : FIO[1]) + ' ' + ((FIO[2] === undefined) ? '': FIO[2]);
  fio = fio.trim();
  return fio
}
export function IsObjectEmpitly(obj){
  if (IsObject(obj)){
    if (obj == null) return true;
    return Object.keys(obj).length == 0
  }
  return true;
}
export function IsObjectNotEmpitly(obj){
  if (IsObject(obj)){
    if (obj == null) return false;
    return Object.keys(obj).length > 0
  }
  return false;
}
export function IsStringGUID(val){
  if (IsString(val)){
    let arr = val.split('-');
    if(arr.length == 5 && arr[0].length == 8 && arr[4].length == 12 && arr[1].length == 4 && arr[2].length == 4 && arr[3].length == 4   ){
      return true;
    }
    return false;
  }
  return false;
}
export function IsNotStringGUID(val){
  if (IsString(val)){
    let arr = val.split('-');
    if(arr.length == 5 && arr[0].length == 8 && arr[4].length == 12 && arr[1].length == 4 && arr[2].length == 4 && arr[3].length == 4   ){
      return false;
    }
    return true;
  }
  return false;
}
export function IsUndefined(val){
  return typeof val == 'undefined'
}
export function IsNumber(val){
  return typeof val == 'number'
}
export function IsBoolean(val){
  return typeof val == 'boolean'
}
export function IsString(val){
  return typeof val == 'string'
}
export function IsCharNumber(char){
  if (char === '0' ||char === '1' ||char === '2' ||char === '3' ||char === '4' ||char === '5' ||char === '6' ||char === '7' ||char === '8' ||char === '9')return true;
  return false;
}
export function IsInStringNumberOnly(val){
  if (!IsString(val)) return false;
  for (let i = 0;i<val.length;i++){
    if (!IsCharNumber(val[i])){
      return false;
    }
  }
  return true;
}
export function IsObject(val){
  return typeof val == 'object'
}
export function IsFunction(val){
  return typeof val == 'function'
}
export function IsArray(val){
  if (IsObject(val)){
    return Array.isArray(val)
  }
  return false;
}
export function IsNotUndefined(val){
  return !typeof val == 'undefined'
}
export function IsNotNumber(val){
  return !typeof val == 'number'
}
export function IsNotBoolean(val){
  return !typeof val == 'boolean'
}
export function IsNotString(val){
  return !typeof val == 'string'
}
export function IsNotObject(val){
  return !typeof val == 'object'
}
export function IsNotFunction(val){
  return !typeof val == 'function'
}
export function IsNotArray(val){
  if (IsObject(val)){
    return !Array.isArray(val)
  }
  return true;
}
export function FindInArrayObjectsByKeyValue(array,value,key){
  let res = {};
 // LOG.log(array,'array');
  array.forEach(item => {
     if (item[key] == value){
       res = item;
       return;
     }
  });
  return res;
}
export function FindInArrayObjectsByKeyValueNonCase(array,value,key){
  let res = {};
 // LOG.log(array,'array');
  if(IsString(value)){
    array.forEach(item => {
      if (item[key].toUpperCase() == value.toUpperCase()){
        res = item;
        return;
      }
    });
  }else{
    res = FindInArrayObjectsByKeyValue(array,value,key);
  }
  return res;
}
export function FindInArrayObjectsByKeyValueSub(array,value,key){
  let res = {};
  for (let i = 0;i < array.length;i++){
    if(array[i][key] != null && IsString(array[i][key])){
        if (array[i][key].indexOf(value) != -1){
           return array[i];
        }
    }
  }
}
export function FindArrayInArrayObjectsByKeyValue(array,value,key){
  let res = [];
  array.forEach(item => {
     if (item[key] == value){
       res.push(item);
     }
  });
 // LOG.log(res,'FindArrayInArrayObjectsByKeyValue');
  return res;
}
export function FindIndexInArrayObjectsByKeyValue(array,value,key){
  let res = -1;
  let find = false;
  array.forEach(item => {
     if (!find){
       res++;
     }
     if (item[key] == value){
       find = true;
       return;
     }
  });
  if (find){
    return res;
  }
  return null;
}
//src == dst == {Dim in ['s','m','h','D','M','Y',null]}
//Oper in ['+','-']
export function OperDate(src = {},dst = {},Oper = '+'){
    if(!IsObjectEmpitly(src)&&!IsObjectEmpitly(dst)){
        if(src.Val != null && dst.Val != null){
           if (Oper == '+'){
              return OperDataSumm(src,dst);
           }else
           if (Oper == '-'){
                return OperDataDiff(src,dst);
           }
        }
    }
    return null;
}
function OperDataConvert(val,dim){
  const s = 1000;
  const m = s * 60;
  const h = m * 60;
  const D = h * 24;
  if(dim != null){
     if(dim == 's'){
       return Number(val) * s;
     }else
     if(dim == 'm'){
       return Number(val) * m;
     }else
     if(dim == 'h'){
       return  Number(val) * h;
     }else
     if(dim == 'D'){
       return  Number(val) * D;
     }
  }
  return null;
}
function OperDataSumm(src,dst){
   //let datsrc = new Date(); let datdst = new Date();
   let _src; let _dst;
   if (src.Dim != null && dst.Dim != null){
     let d1 = OperDataConvert(src.Val,src.Dim); let d2 = OperDataConvert(dst.Val,dst.Dim);
     if (d1 != null && d2 != null){
        return d1 + d2;
     }
     return null;
   }else
   if (src.Dim == null && dst.Dim == null){
     return null;
   }else
   if (src.Dim == null){
     _src = src; _dst = dst;
   }else{
     _src = dst; _dst = src;
   }
   let _datsrc = new Date(_src.Val);
   if (_dst.Dim == 'Y'){
        _datsrc.setFullYear(_datsrc.getFullYear() + _dst.Val);
   }else
   if (_dst.Dim == 'M'){
       _datsrc.setMonth(_datsrc.getMonth() + _dst.Val);
   }else
   if (_dst.Dim == 'D'){
       _datsrc.setDate(_datsrc.getDate() + _dst.Val);
   }else
   if (_dst.Dim == 'h'){
       _datsrc.setHours(_datsrc.getHours() + _dst.Val);
   }else
   if (_dst.Dim == 'm'){
       _datsrc.setMinutes(_datsrc.getMinutes() + _dst.Val);
   }else
   if (_dst.Dim == 's'){
       _datsrc.setSeconds(_datsrc.getSeconds() + _dst.Val);
   }
   return _datsrc.toISOString();
}
function OperDataDiff(src,dst){
  // let rd_ = Date.now();
  // let rd = new Date();
  // rd.setTime(rd_);
  // LOG.log(rd.toLocaleString(),'rd');
   //let datsrc = new Date(); let datdst = new Date();
   let _src; let _dst;
   if (src.Dim != null && dst.Dim != null){
     let d1 = OperDataConvert(src.Val,src.Dim); let d2 = OperDataConvert(dst.Val,dst.Dim);
     if (d1 != null && d2 != null){
        let _dat = new Date(data)
        return d1-d2;
     }
     return null;
   }else
   if (src.Dim == null && dst.Dim == null){
     return null;
   }else
   if (src.Dim == null){
     _src = src; _dst = dst;
   }else{
     _src = dst; _dst = src;
   }
   let _datsrc = new Date(_src.Val);
   //LOG.log(_datsrc);
   if (_dst.Dim == 'Y'){
        _datsrc.setFullYear(_datsrc.getFullYear() - _dst.Val);
   }else
   if (_dst.Dim == 'M'){
       _datsrc.setMonth(_datsrc.getMonth() - _dst.Val);
   }else
   if (_dst.Dim == 'D'){
     //  LOG.log(_datsrc.getDate() - _dst.Val,'_datsrc.getDate()');
       _datsrc.setDate(_datsrc.getDate() - _dst.Val);
     // LOG.log(_datsrc.toUTCString(),'_datsrc');
   }else
   if (_dst.Dim == 'h'){
       _datsrc.setHours(_datsrc.getHours() - _dst.Val);
   }else
   if (_dst.Dim == 'm'){
       _datsrc.setMinutes(_datsrc.getMinutes() - _dst.Val);
   }else
   if (_dst.Dim == 's'){
       _datsrc.setSeconds(_datsrc.getSeconds() - _dst.Val);
   }
   //LOG.log(_datsrc,'_datsrc');
   return _datsrc.toISOString();
} 

//{_PP_TASK_Rew}

import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
export class TTask{
    constructor(ProjectId,TaskId = null){
        this.ProjectId = ProjectId;
        this.Id = TaskId;
    }
    /*
    Создаёт новую задачу и возвращает экзэмпляр класса с TaskId = Id созданной задачи
    Priority,TaskState,Responsibles,NotificationTypes Может принимать три типа параметров
    Объект,GUID,Имя
    EndDate,TaskName сторка
     */
    _GetTypeValue(val){
      if (REST.IsObject(val)){
        return val;
      }else{
        if (REST.IsStringGUID(val)){
          return {Id:val}
        }else{
          if(REST.IsString(val)){
            return {Name:val}
          }
        }
      }
      return null;
    }
    _CreateGetTaskName(TaskName){
      if (REST.IsObject(TaskName)){
        return  TaskName;
      }else {
        return  {Name:TaskName};
      }
      return null;
    }
    Create(Priority,TaskState,TaskName,Responsibles,NotificationTypes,EndDate){
        let data = {};
        data.Priority          =  this._GetTypeValue(Priority);
        data.TaskState         =  this._GetTypeValue(TaskState);
        data.Responsibles      = [this._GetTypeValue(Responsibles)];
        data.NotificationTypes =  this._GetTypeValue(NotificationTypes);
        data.ProjectType = {Id:this._GetProjectType()};
        data.ProjectId =  this.ProjectId;
        data.TaskName  =  this._CreateGetTaskName
        data.EndDate = EndDate;
        data._timeLogs = [];
        data.TimeLogs =  [];
        data.Documents = [];
        data.VisualBlockValueLines = [];
        data.Project = {Id:this.ProjectId};
        let ret = this._PUTCreateTask(data);
        return new TTask(this.ProjectId,ret.Result.Id);
    }
   //Получает значение напоминания по 'SysName'
    GetNotificationTypeByName(name){
      let res = this._POSTGetNotificationTypes({EntitySysName:	'Task'})
      if (res != null){
        res = REST.FindInArrayObjectsByKeyValue(res,name,'SysName');
        if (res != null){
          return res;
        }
      }
      return null;
    }
   //Получает значения напоминания по 'SysName'
    GetNotificationTypesByNames(names = []){
      let arr = this._POSTGetNotificationTypes({EntitySysName:	'Task',"Page":1,"PageSize":100500})
      let res = [];
      if (arr != null){
        names.forEach(name => {
          res.push(REST.FindInArrayObjectsByKeyValue(arr,name,'SysName'))
        });
      }
      return res;
    }
    //Получает все значения Напоминаний
    GetNotificationTypes(){
      let res = this._POSTGetNotificationTypes({EntitySysName:	'Task',"Page":1,"PageSize":100500})
      if (res != null){
        return res;
      }
      return null;
    }
    //Получает Ответственного по имени или всех ответственных
    GetResponsible(Name = null){
      let data;
      if(Name == null){
        data = {"Page":1,"PageSize":100500};
      }else{
        data = {Name:Name};
      }
      let res = this._POSTGetResponsibles(data);
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает Ответственного по имени
    GetResponsibleByName(Name){
      return this.GetResponsible(Name);
    }
    //Получает всех ответственных
    GetResponsibles(){
      return this.GetResponsible();
    }
    //Получает приоритет по названию или все приоритеты
    GetPriority(Name = null){
      let data;
      if(Name == null){
        data = {"SystemName":"Tasks.TaskPriority","Page":1,"PageSize":100500};
      }else{
        data = {"SystemName":"Tasks.TaskPriority",Name:Name};
      }
      let res = this._POSTGetDictonaryItems(data);
      if (res != null){
        return res[0];
      }
      return null;
    }
   //Получает приоритет по названию
    GetPriorityByName(Name){
      return this.GetPriority(Name);
    }
    //Получает все приоритеты
    GetPrioritys(){
      return this.GetPriority();
    }
    //Получает статус по названию или все статусы
    GetState(Name = null){
      let data;
      if(Name == null){
        data = {"SystemName":"Tasks.TaskState","Page":1,"PageSize":100500};
      }else{
        data = {"SystemName":"Tasks.TaskState",Name:Name};
      }
      let res = this._POSTGetDictonaryItems(data);
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает статус по названию
    GetStateByName(Name){
      return this.GetState(Name);
    }
    //Получает всех статусы
    GetStates(){
      return this.GetState();
    }
   /* _POSTGetTaskInfo(){
       return  AJAX.POSTGET('/api/Tasks/GetGroupedTasks',{})[0].Tasks[0];
    }*/
    //Обёртка над API
    _POSTGetResponsibles(data){
      return AJAX.POSTGET('/api/TaskUsersAndGroupsSuggest/GetTaskUsersAndGroups',data)
    }
    _POSTGetDictonaryItems(data){
      return AJAX.POSTGET('/api/dictionary/getdictionaryitems',data)
    }
    _POSTGetNotificationTypes(data){
      return AJAX.POSTGET('/api/NotificationTypesSuggest/GetNotificationTypes',data)
    }
    _PUTCreateTask(data){
      return AJAX.PUT('/api/Tasks/PutTask/',data);
    }
    _GetProjectType(){
      return AJAX.GET('/api/Projects/GetProject/' + this.ProjectId).ProjectType.Id;
    }
} 

//{_PP_TASK}

import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
export class TTask{
    constructor(ProjectId,TaskId = null){
        this.ProjectId = ProjectId;
        this.Id = TaskId;
    }
    /*
    Создаёт новую задачу и возвращает экзэмпляр класса с TaskId = Id созданной задачи
    Priority,TaskState,Responsibles,NotificationTypes Может принимать три типа параметров
    Объект,GUID,Имя
    EndDate,TaskName сторка
     */
    Create(Priority,TaskState,TaskName,Responsibles,NotificationTypes,EndDate){
        let data = {};
        if (REST.IsObject(Priority)){
          data.Priority = Priority;
        }else {
          if (REST.IsStringGUID(Priority)){
            data.Priority = {Id:Priority};
          }else{
             if(REST.IsString(Priority)){
               data.Priority = {Name:Priority};
             }
          }
        }
        if (REST.IsObject(TaskState)){
          data.TaskState = TaskState;
        }else {
          if (REST.IsStringGUID(TaskState)){
            data.TaskState = {Id:TaskState};
          }else{
             if(REST.IsString(TaskState)){
               data.TaskState = {Name:TaskState};
             }
          }
        }
        if (REST.IsObject(Responsibles)){
          data.Responsibles = [Responsibles];
        }else {
          if (REST.IsStringGUID(Responsibles)){
            data.Responsibles = [{Id:Responsibles}];
          }else{
             if(REST.IsString(Responsibles)){
               data.Responsibles = [{Name:Responsibles}];
             }
          }
        }
        if (REST.IsObject(NotificationTypes)){
          data.NotificationTypes = NotificationTypes;
        }else {
          if (REST.IsStringGUID(NotificationTypes)){
            data.NotificationTypes = {Id:NotificationTypes};
          }else{
             if(REST.IsString(NotificationTypes)){
               data.NotificationTypes = {Name:NotificationTypes};
             }
          }
        }
        data.ProjectType = {Id:this._GetProjectType()};
        data.ProjectId =  this.ProjectId;
        if (REST.IsObject(TaskName)){
          data.TaskName = TaskName;
        }else {
          data.TaskName = {Name:TaskName};
        }
        data.EndDate = EndDate;
        data._timeLogs = [];
        data.TimeLogs =  [];
        data.Documents = [];
        data.VisualBlockValueLines = [];
        data.Project = {Id:this.ProjectId};
        let ret = this._PUTCreateTask(data);
        return new TTask(this.ProjectId,ret.Result.Id);
    }
   //Получает значение напоминания по 'SysName'
    GetNotificationTypeByName(name){
      let res = this._POSTGetNotificationTypes({EntitySysName:	'Task'})
      if (res != null){
        res = REST.FindInArrayObjectsByKeyValue(res,name,'SysName');
        if (res != null){
          return res;
        }
      }
      return null;
    }
   //Получает значения напоминания по 'SysName'
    GetNotificationTypesByNames(names = []){
      let arr = this._POSTGetNotificationTypes({EntitySysName:	'Task',"Page":1,"PageSize":100500})
      let res = [];
      if (arr != null){
        names.forEach(name => {
          res.push(REST.FindInArrayObjectsByKeyValue(arr,name,'SysName'))
        });
      }
      return res;
    }
    //Получает все значения Напоминаний
    GetNotificationTypes(){
      let res = this._POSTGetNotificationTypes({EntitySysName:	'Task',"Page":1,"PageSize":100500})
      if (res != null){
        return res;
      }
      return null;
    }
    //Получает Ответственного по имени или всех ответственных
    GetResponsible(Name = null){
      let data;
      if(Name == null){
        data = {"Page":1,"PageSize":100500};
      }else{
        data = {Name:Name};
      }
      let res = this._POSTGetResponsibles(data);
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает Ответственного по имени
    GetResponsibleByName(Name){
      let res = this._POSTGetResponsibles({Name:Name})
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает всех ответственных
    GetResponsibles(){
      let res = this._POSTGetResponsibles({"Page":1,"PageSize":100500})
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает приоритет по названию или все приоритеты
    GetPriority(Name = null){
      let data;
      if(Name == null){
        data = {"SystemName":"Tasks.TaskPriority","Page":1,"PageSize":100500};
      }else{
        data = {"SystemName":"Tasks.TaskPriority",Name:Name};
      }
      let res = this._POSTGetDictonaryItems(data);
      if (res != null){
        return res[0];
      }
      return null;
    }
   //Получает приоритет по названию
    GetPriorityByName(Name){
      let res = this._POSTGetDictonaryItems({"SystemName":"Tasks.TaskPriority",Name:Name});
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает все приоритеты
    GetPrioritys(){
      let res = this._POSTGetDictonaryItems({"SystemName":"Tasks.TaskPriority","Page":1,"PageSize":100500});
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает статус по названию или все статусы
    GetState(Name = null){
      let data;
      if(Name == null){
        data = {"SystemName":"Tasks.TaskState","Page":1,"PageSize":100500};
      }else{
        data = {"SystemName":"Tasks.TaskState",Name:Name};
      }
      let res = this._POSTGetDictonaryItems(data);
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает статус по названию
    GetStateByName(Name){
      let res = this._POSTGetDictonaryItems({"SystemName":"Tasks.TaskState",Name:Name});
      if (res != null){
        return res[0];
      }
      return null;
    }
    //Получает всех статусы
    GetStates(){
      let res = this._POSTGetDictonaryItems({"SystemName":"Tasks.TaskState","Page":1,"PageSize":100500});
      if (res != null){
        return res[0];
      }
      return null;
    }
   /* _POSTGetTaskInfo(){
       return  AJAX.POSTGET('/api/Tasks/GetGroupedTasks',{})[0].Tasks[0];
    }*/
    //Обёртка над API
    _POSTGetResponsibles(data){
      return AJAX.POSTGET('/api/TaskUsersAndGroupsSuggest/GetTaskUsersAndGroups',data)
    }
    _POSTGetDictonaryItems(data){
      return AJAX.POSTGET('/api/dictionary/getdictionaryitems',data)
    }
    _POSTGetNotificationTypes(data){
      return AJAX.POSTGET('/api/NotificationTypesSuggest/GetNotificationTypes',data)
    }
    _PUTCreateTask(data){
      return AJAX.PUT('/api/Tasks/PutTask/',data);
    }
    _GetProjectType(){
      return AJAX.GET('/api/Projects/GetProject/' + this.ProjectId).ProjectType.Id;
    }
} 

//{_PP_VISUALBLOCK_CREATE_TEMP_STRUCT}

import * as AJAX from '_PP_AJAX';
import  {log} from '_PP_LOG';
import * as REST from '_PP_REST';
export class TVisualBlocksCreateTmp{
  constructor(ProjectId){
    this.ProjectId = ProjectId;
    return  this._GetProjectDataMainBlocks();
  }
    _GetProjectDataMainBlocks() {
        let res = [];
        let responseBlocks = this._GETAll();
        log(responseBlocks,'responseBlocks');
        responseBlocks.MetadataOfBlocks.forEach(item => {
        let block;
        let line = [];
        if(item.IsRepeatable){
          res.push({Block:[],VisualBlockId:item.Id})
          block = this._FindArrayBlockIdFromVisualBlockId(responseBlocks.Blocks,item.Id),'IsRepeatable';
          block.forEach(bl =>{
            if(REST.IsObjectNotEmpitly(bl)){
              line = bl.Lines;
            }
            res[res.length-1].Block.push({Id:bl.Id,VisualBlockId:item.Id,Name:bl.Name,Lines:this._GetLinesForBlock(item,line)});
          })
        }else{
          block = this._FindBlockIdFromVisualBlockId(responseBlocks.Blocks,item.Id);
          if(REST.IsObjectNotEmpitly(block)){
            line = block.Lines;
          }
          res.push({Id:block.Id,VisualBlockId:item.Id,Name:block.Name,Lines:this._GetLinesForBlock(item,line)});
        }
       // block = this._FindBlockIdFromVisualBlockId(responseBlocks.Blocks,item.Id)
        });
        return res;
    }
    _FindValuesIdFromBlockValueId(Values,BlockValuesId){
      if (Values != null){
          return REST.FindInArrayObjectsByKeyValue(Values,BlockValuesId,'VisualBlockProjectFieldId').Value;
      }
      return null;
    }
    _GetDictonaryItemList(SystemName,Level){
      if (!(SystemName == null)){
          let lev = Level;
          if(lev <= 0){
          lev = 1;
          }
          let res = this._GetDictonaryItems({"SystemName":SystemName,"DictionaryLevel":lev});
          if (lev == 1){
          return res;
          }
          if (lev == 2){
          return res[0].Items;
          }
      }
      return  [];
    }
    _GetDictonaryItemListV2(SystemName){
      let res = [];
      if (!(SystemName == null)){
          let res = this._GetDictonaryItems({"SystemName":SystemName});
          return  res;
      }
    }
    _GetFieldsForLine(line,Values){
      let fields = [];
      line.Fields.forEach(item => {
          let df = item.ProjectField.DataFormat;
          let dic = null;
          let dic2 = null;
          let Depth = 1;
          let val;
          val  = this._FindValuesIdFromBlockValueId(Values,item.Id);
          if (df.SysName == "Dictionary" ){
              if (item.ProjectField.TopLevelProjectFieldFormat.Dictionary != null){
                Depth = item.ProjectField.TopLevelProjectFieldFormat.Dictionary.Depth;
                Depth = item.ProjectField.DictionaryLevel;
              }
              dic  =  this._GetDictonaryItemList  (df.Dictionary.SystemName,Depth);
              dic2 =  this._GetDictonaryItemListV2(df.Dictionary.SystemName);
          }
          if(df.SysName  == 'CalculationFormula'){
              let cf = item.ProjectField.CalculationFormulas;
              if (val != null){
              cf[0].Result = val.Result;
              }else{
              cf[0].Result = null;
              }
              val = cf;
          }
          fields.push({Id:item.Id,Name:item.ProjectField.Name,Val:val,dic:dic,dicV2:dic2,Type:df.SysName,Dictionary:df.Dictionary,Tag:item.Tag,ExternalTag:item.ExternalTag});
      });
      return fields;
    }
    _FindLinesIdFromBlockLineId(lines,BlockLineId){
      if (lines != null){
          return REST.FindInArrayObjectsByKeyValue(lines,BlockLineId,'BlockLineId').Id;
      }
      return null;
    }
    _FindArrayLinesIdFromBlockLineValues(lines,BlockLineId){
      if (lines != null){
          return REST.FindArrayInArrayObjectsByKeyValue(lines,BlockLineId,'BlockLineId');
      }
      return null;
    }
    _FindLinesIdFromBlockLineValues(lines,BlockLineId){
      if (lines != null){
          return REST.FindInArrayObjectsByKeyValue(lines,BlockLineId,'BlockLineId').Values;
      }
      return null;
    }
    _GetLinesForBlock(block,Lines){
      let lines = [];
      block.Lines.forEach(item => {
          let ln;
          let LinesId = this._FindLinesIdFromBlockLineId(Lines,item.Id);
          if (item.LineType.SysName == 'Repeated'){
            let lna = [];
            lna = this._FindArrayLinesIdFromBlockLineValues(Lines,item.Id);
            let arr = [];
            lna.forEach(item1 =>{
              let val = item1.Values;
              arr.push({BlockLineId:item.Id,Id:LinesId,Fields:this._GetFieldsForLine(item,val),Type:item.LineType.SysName});
            });
            lines.push({BlockLineId:item.Id,Id:LinesId,Type:item.LineType.SysName,Lines:arr});
          }else{
            ln = this._FindLinesIdFromBlockLineValues(Lines,item.Id);
            lines.push({BlockLineId:item.Id,Id:LinesId,Fields:this._GetFieldsForLine(item,ln),Type:item.LineType.SysName});
          }
      });
      return lines;
    }
    _FindBlockIdFromVisualBlockId(block,VisualBlockId){
      return REST.FindInArrayObjectsByKeyValue(block,VisualBlockId,'VisualBlockId');
    }
    _FindArrayBlockIdFromVisualBlockId(block,VisualBlockId){
      return REST.FindArrayInArrayObjectsByKeyValue(block,VisualBlockId,'VisualBlockId');
    }
    _GETAll(){
        return AJAX.GET(`/api/ProjectCustomValues/GetAllVisualBlocks?ProjectId=${this.ProjectId}`);
    }
    _GetDictonaryItems(data){
      return AJAX.POST('/api/dictionary/getdictionaryitems',data).Result;
    }
} 

//{_PP_VISUALBLOCK_CREATE_WRITE_BLOCKS_Rew}

import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
import * as PAR from '_PP_PARCIPIANT';
export class TVisualBlocksCreateWrite{
    constructor(Blocks){
        this.blocks = Blocks;
        return  this._SetVisualBlocks(this.blocks);
    }
    _FindToDictonary(dic,value,key){
      if(REST.IsArray(dic)){
        let l = dic.length;
        if(l == 0){
          return null
        }else{
          for(let i = 0;i<l;i++){
            let s1 = dic[i][key].toUpperCase();
            let s2 = value.toUpperCase();
            s1 = s1.replace(/\s/g, '');
            s2 = s2.replace(/\s/g, '');
            if (s1 == s2){
              return dic[i];
            }
            let res = this._FindToDictonary(dic[i].Items,value,key);
            if (res != null){
              return res;
            }
          }
        }
      }
      return null;
    }
    _SetVisualBlocksLinesValuesCalculationFormula(val){
       if (REST.IsArray(val)){
          return {CalculationFormulaId:val[0].Id,Result:0};
       }else{
          if (REST.IsString(val)){
            val = Number(val.replace(',', '.'));
            return {Result:Number(val)}
          }
       }
       return null;
    }
    _SetVisualBlocksLinesValuesParticipant(val){
      if (REST.IsObject(val)){
        return val;
      }else{
        let par = new PAR.TParcipiant();
        let org = par.GetOrganization(val);
        if (org != null){
          return org[0];
        }
      }
      return null;
    }
    _SetVisualBlocksLinesValuesDictionary(val,dic){
      if (REST.IsObject(val)){
        return val;
      }else{
        let d = this._FindToDictonary(dic,val,'Name');
        if (d != null){
          return d;
        }
      }
      return null;
    }
    _SetVisualBlocksLinesValues(Fields){
      let res = [];
      Fields.forEach(item => {
        let Value = {};
        let val = item.Val;
        if(val != null ){
          if (item.Type ==  'CalculationFormula'){
            val = this._SetVisualBlocksLinesValuesCalculationFormula(val);
          }else if (item.Type ==  'Dictionary'){
            val  = this._SetVisualBlocksLinesValuesDictionary(val,item.dicV2);
          }else if(item.Type ==  'Participant'){
            val  = this._SetVisualBlocksLinesValuesParticipant(val);
          }
          if(val != null ){
            res.push({VisualBlockProjectFieldId:item.Id,Value:val});
          }
        }
      })
      if(res.length == 0){
          res = null;
      }
      return res;
    }
    _SetVisualBlocksLines(Lines){
      let res = [];
      Lines.forEach(item => {
        let val
        if (item.Fields == null){
          item.Lines.forEach(ln =>{
            val =  this._SetVisualBlocksLinesValues(ln.Fields);
            res.push({BlockLineId:ln.BlockLineId,Order:0,Values:val});
          });
          val = null;
        }else{
          val =  this._SetVisualBlocksLinesValues(item.Fields);
        }
        if(val != null){
            res.push({BlockLineId:item.BlockLineId,Order:0,Values:val});
        }
      })
      if(res.length == 0){
          res = null;
      }
      return res;
    }
    _SetVisualBlocks(array){
      let res = [];
      array.forEach(item => {
        let Lines;
        if(item.Lines != null){
          Lines = this._SetVisualBlocksLines(item.Lines);
          if(Lines != null){
            res.push({Order:0,FrontOrder:0,VisualBlockId:item.VisualBlockId,Lines:Lines});
          }
        }
        if(item.Block != null){
          item.Block.forEach(bl =>{
            Lines = this._SetVisualBlocksLines(bl.Lines);
            res.push({Order:0,FrontOrder:0,VisualBlockId:bl.VisualBlockId,Lines:Lines});
          });
        }
      });
      return res;
    }
} 

//{_PP_VISUALBLOCK_CREATE_WRITE_BLOCKS}

import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
import * as PAR from '_PP_PARCIPIANT';
export class TVisualBlocksCreateWrite{
    constructor(Blocks){
        this.blocks = Blocks;
        return  this._SetVisualBlocks(this.blocks);
    }
    _FindToDictonary(dic,value,key){
      if(REST.IsArray(dic)){
        let l = dic.length;
        if(l == 0){
          return null
        }else{
          for(let i = 0;i<l;i++){
            let s1 = dic[i][key].toUpperCase();
            let s2 = value.toUpperCase();
            s1 = s1.replace(/\s/g, '');
            s2 = s2.replace(/\s/g, '');
            if (s1 == s2){
              return dic[i];
            }
            let res = this._FindToDictonary(dic[i].Items,value,key);
            if (res != null){
              return res;
            }
          }
        }
      }
      return null;
    }
    _SetVisualBlocksLinesValues(Fields){
      let res = [];
      Fields.forEach(item => {
        let Value = {};
        let val = item.Val;
        if(val != null ){
          if (item.Type ==  'CalculationFormula'){
              if (REST.IsArray(val)){
                res.push({VisualBlockProjectFieldId:item.Id,Value:{CalculationFormulaId:val[0].Id,Result:0}});
              }else{
                if (REST.IsString(val)){
                  val = Number(val.replace(',', '.'));
                }
                res.push({VisualBlockProjectFieldId:item.Id,Value:{Result:Number(val)}});
              }
          }else if (item.Type ==  'Dictionary'){
            if (REST.IsObject(val)){
              res.push({VisualBlockProjectFieldId:item.Id,Value:val});
            }else{
              LOG.log(item.dicV2,'Dictionary.SystemName');
              let d = this._FindToDictonary(item.dicV2,val,'Name');
              if (d != null){
                res.push({VisualBlockProjectFieldId:item.Id,Value:d});
              }
            }
          }else if(item.Type ==  'Participant'){
            if (REST.IsObject(val)){
              res.push({VisualBlockProjectFieldId:item.Id,Value:val});
            }else{
              let par = new PAR.TParcipiant();
              let p = par.GetOrganization(val);
              if (p != null){
                res.push({VisualBlockProjectFieldId:item.Id,Value:p[0]});
              }
            }
          }else{
            res.push({VisualBlockProjectFieldId:item.Id,Value:val});
          }
        }
      })
      if(res.length == 0){
          res = null;
      }
      return res;
    }
    _SetVisualBlocksLines(Lines){
      let res = [];
      Lines.forEach(item => {
        let val
        if (item.Fields == null){
          item.Lines.forEach(ln =>{
            val =  this._SetVisualBlocksLinesValues(ln.Fields);
            res.push({BlockLineId:ln.BlockLineId,Order:0,Values:val});
          });
          val = null;
        //  val =  this._SetVisualBlocksLinesValues(item.Lines);
        }else{
          val =  this._SetVisualBlocksLinesValues(item.Fields);
        }
        if(val != null){
            res.push({BlockLineId:item.BlockLineId,Order:0,Values:val});
        }
      })
      if(res.length == 0){
          res = null;
      }
      return res;
    }
    _SetVisualBlocks(array){
      let res = [];
      array.forEach(item => {
        let Lines;
        if(item.Lines != null){
          Lines = this._SetVisualBlocksLines(item.Lines);
          if(Lines != null){
            res.push({/*ProjectId:this.ProjectId,*/Order:0,FrontOrder:0,VisualBlockId:item.VisualBlockId,Lines:Lines});
          }
        }
        if(item.Block != null){
          item.Block.forEach(bl =>{
            Lines = this._SetVisualBlocksLines(bl.Lines);
            res.push({/*ProjectId:this.ProjectId,*/Order:0,FrontOrder:0,VisualBlockId:bl.VisualBlockId,Lines:Lines});
          });
        }
      });
      LOG.log(res,'_SetVisualBlocks')
      return res;
    }
} 

//{_PP_VISUALBLOCKS_V2}

//поправить костыль с мультиблоками и мультистроками
import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
import {TVisualBlocksCreateTmp}   from '_PP_VISUALBLOCK_CREATE_TEMP_STRUCT'
import {TVisualBlocksCreateWrite} from '_PP_VISUALBLOCK_CREATE_WRITE_BLOCKS'
export class TVisualBlocksV2{
    constructor(ProjectId){
      this.ProjectId = ProjectId;
      this.blocks    = this.GetProjectDataMainBlocks();
      LOG.log(this.blocks);
    }
   GetProjectDataMainBlocks(){
      return new TVisualBlocksCreateTmp(this.ProjectId);
    }
    GetCurrentBlocks(){
      return this.blocks;
    }
    GetBlock(Param){
      let res = null;
      if(REST.IsStringGUID(Param)){
        res = REST.FindInArrayObjectsByKeyValueSub(this.blocks,Param,'VisualBlockId');
      }else if (REST.IsString(Param)){
        res = REST.FindInArrayObjectsByKeyValueSub(this.blocks,Param,'Name');
      }else if(REST.IsNumber(Param)){
        res = this.blocks[i];
      }
      return res;
    }
    _GetBlockIndex(Param){
      let res = null;
      if(REST.IsStringGUID(Param)){
        res = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,Param,'VisualBlockId');
      }else if (REST.IsString(Param)){
        res = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,Param,'Name');
      }
      return res;
    }
    MoveBlock(Block,Moves){
      let move = this.GetBlock(Moves);
      if(Block.VisualBlockId != null && move != null){
        if (Block.VisualBlockId == move.VisualBlockId){
          let index = this._GetBlockIndex(Moves)
          if (index != null){
            this.blocks.splice(index,1);
            this.blocks.push(Block);
          }
        }
      }
    }
    ClearBlock(Block){
      let index = this._GetBlockIndex(Block);
      if (index != null){
        this.blocks.splice(index,1);
      }
    }
    AddMultiBlock(Block){
      let index = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,Block.VisualBlockId,'VisualBlockId');
      if (index != null){
        if(this.blocks[index].Block != null){
          this.blocks[index].Block.push(Block);
        }
      }
    }
    DeleteMultiBlock(Block,DeleteBlock){
      let index = this._GetBlockIndex(Block);
      if (index != null){
        if(this.blocks[index].Block != null){
          if(REST.IsNumber(DeleteBlock)){
            this.blocks[index].Block.splice(DeleteBlock,1);
          }else if(REST.IsObject(DeleteBlock)){
          }
        }
      }
    }
    //поправить костыль с мультиблоками и мультистроками
    //не изменять используется в внешнем скрипте
    SetValueByIds(val,VisualBlockId,BlockLineId,FieldId){
      let multiblock = false;
      let multistr = false;
      let indexblock = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
      let block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
      if(block.Lines == null){
        if(block.Block != null){
          block = block.Block[0];
          multiblock = true;
        }
      }
      let indexline  = REST.FindIndexInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
      let line = REST.FindInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
      if(line.Fields == null){
        if(line.Lines != null){
          line = line.Lines[0];
          multistr = true;
        }
      }
      let indexfild = REST.FindIndexInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      let field = REST.FindInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      if (multiblock && !multistr){
        this.blocks[indexblock].Block[0].Lines[indexline].Fields[indexfild].Val = val;
      }else
      if (multiblock && multistr){
        this.blocks[indexblock].Block[0].Lines[indexline].Lines[0].Fields[indexfild].Val = val;
      }else
      if (!multiblock && multistr){
        this.blocks[indexblock].Lines[indexline].Lines[0].Fields[indexfild].Val = val;
      }else{
        this.blocks[indexblock].Lines[indexline].Fields[indexfild].Val = val;
      }
    }
    SetValue(Val,Field = null,BlockLine = null,VisualBlock=null){
      let path = this.GetPath(Field,BlockLine,VisualBlock);
      if(path != null){
         this.SetValueByIds(Val,path.VisualBlockId,path.BlockLineId,path.Id);
      }
    }
    GetValue(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      return this._GetValue(Field,BlockLine,VisualBlock,Path);
    }
    GetValueEx(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      return this._GetValueEx(Field,BlockLine,VisualBlock,Path);
    }
    GetDictonary(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      let res = this._GetValue(Field,BlockLine,VisualBlock,Path);
      if (res != null){
        if(REST.IsArray(Val)){
        }
        return res.dic;
      }
      return null;
    }
    _GetValue(Field = null,BlockLine = null,VisualBlock=null){
      let res = this._GetValueEx(Field,BlockLine,VisualBlock);
      if(res.Find != false){
        let tmp = {};
        if(res.blocks != null){
          tmp.blocks = res.blocks;
          return tmp;
        }else
        if(res.lines != null){
          tmp.lines = res.lines;
          return tmp;
        }else
        if(res.data != null){
          tmp = res.data;
          return tmp;
        }
      }
      return null;
    }
    _GetValueEx(Field = null,BlockLine = null,VisualBlock=null){
      let res = null;
      if(Field != null){
        this.typeField = this._GetValueType(Field);
        if (this.typeField != null){
          this.typeBlock = this._GetValueType(VisualBlock);
          this.typeLine  = this._GetValueType(BlockLine);
          this.FieldVal       = Field;
          this.BlockLineVal   = BlockLine;
          this.VisualBlockVal = VisualBlock;
          res = this._GetLineByBlock(this.blocks);
        }
      }
      return res;
    }
    GetPath(Field = null,BlockLine = null,VisualBlock=null){
      let tmp = this._GetValueEx(Field,BlockLine,VisualBlock);
      if(tmp.Find){
        let path = {};
        path.BlockId = tmp.VisualBlockId;
        path.LineId  = tmp.BlockLineId;
        path.FieldId = tmp.Id;
        return path;
      }
       return null;
    }
    _GetValueByTypeFields(fields = []){
      let res = {}
      let item = null;
      res.Find = false;
      if(this.typeField == 'id')   {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Id');}else
      if(this.typeField == 'index'){item = fields[this.FieldVal];}else
      if(this.typeField == 'name') {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Name');}
      if(REST.IsObjectNotEmpitly(item)){
        res.Find  = true;
        res.Id    = item.Id;
        res.data = item;
      }
      return res;
    }
    _GetFieldsByMultiLine(MulLin = []){
      let res = {}
      let arr = [];
      let tmp = {};
      let itm = null;
      res.Find = false;
      MulLin.forEach(item =>{
        tmp = this._GetValueByTypeFields(item.Fields);
        if (tmp.Find){
          arr.push(tmp.data)
          itm = item;
        }
      });
      if (itm != null){
        //res.BlockLineId = itm.BlockLineId;
        res.lines = arr;
        res.Id = tmp.Id;
        res.Find = true;
      }
      return res;
    }
    _GetFieldsByLine_item(item){
        let res = null;
        let tmp = {};
        if(item.Type == 'Repeated'){
          tmp = this._GetFieldsByMultiLine(item.Lines);
        }else{
          tmp = this._GetValueByTypeFields(item.Fields)
        }
        if(tmp.Find){
          res = tmp;
          res.BlockLineId = item.BlockLineId;
        }
        return res;
      }
    _GetFieldsByLine(line = []){
      let res = {}
      let tmp = {};
      if(this.typeLine == 'id')   {tmp = REST.FindInArrayObjectsByKeyValue(line,this.BlockLineVal,'BlockLineId');}else
      if(this.typeLine == 'index'){tmp = line[this.BlockLineVal];}
      if(REST.IsObjectNotEmpitly(tmp)){
        res = this._GetFieldsByLine_item(tmp);
      }else{
      for(let i = 0;i<line.length;i++){
        res = this._GetFieldsByLine_item(line[i]);
        if(res != null){
          break;
        }
      }}
      if (res == null){
        res = {};
        res.Find = false;
      }
      return res;
    }
    _GetLineByMultiBlock(MBlock = []){
      let res = {}
      let arr = [];
      let tmp = {};
      let itm = null;
      res.Find = false;
      MBlock.forEach(item =>{
        tmp = this._GetFieldsByLine(item.Lines);
        if (tmp.Find){
          arr.push(tmp.lines)
          itm = item;
        }
      });
      if (itm != null){
        res.blocks = arr;
        res.Id = tmp.Id;
        res.BlockLineId =  tmp.BlockLineId;
        res.Find = true;
      }
      return res;
    }
    _GetLinesByBlock_item(item){
        let res = null;
        let tmp = {};
        if(item.Block != null){
          tmp = this._GetLineByMultiBlock(item.Block);
        }else{
          tmp = this._GetFieldsByLine(item.Lines)
        }
        if(tmp.Find){
          res = tmp;
          res.VisualBlockId = item.VisualBlockId;
        }
        return res;
      }
    _GetLineByBlock(block = []){
      let res = {}
      let item = null;
      res.Find = false;
      if(this.typeBlock == 'id')   {item = REST.FindInArrayObjectsByKeyValue(block,this.VisualBlockVal,'Id');}else
      if(this.typeBlock == 'index'){item = block[this.VisualBlockVal];}else
      if(this.typeBlock == 'name') {item = REST.FindInArrayObjectsByKeyValue(block,this.VisualBlockVal,'Name');}
      if(REST.IsObjectNotEmpitly(item)){
        res = this._GetLinesByBlock_item(item);
      }else{
      for(let i = 0;i<block.length;i++){
        res = this._GetLinesByBlock_item(block[i]);
        if(res != null){
          break;
        }
      }}
      if (res == null){
        res = {};
        res.Find = false;
      }
      return res;
    }
    _GetValueType(val){
      if (REST.IsStringGUID(val)){
        return 'id';
      }else {
        if (REST.IsString(val)){
          return 'name';
        }else{
            if(REST.IsNumber(val)){
              return 'index'
            }
        }
      }
      return null;
    }
    GetUpdate(){
      this._GetUpdate();
      return this.UpdateVisualBlock;
    }
    _GetUpdate(){
      this.UpdateVisualBlock = new TVisualBlocksCreateWrite(this.blocks);
    }
    _FindArrayValuesIdFromBlockValueId(Values,BlockValuesId){
      if (Values != null){
          return REST.FindArrayInArrayObjectsByKeyValue(Values,BlockValuesId,'VisualBlockProjectFieldId').Value;
      }
      return null;
    }
    _GETAll(){
        return AJAX.GET(`/api/ProjectCustomValues/GetAllVisualBlocks?ProjectId=${this.ProjectId}`);
    }
} 

//{_PP_VISUALBLOCKS}

//поправить костыль с мультиблоками и мультистроками
import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
import {TVisualBlocksCreateTmp}   from '_PP_VISUALBLOCK_CREATE_TEMP_STRUCT'
import {TVisualBlocksCreateWrite} from '_PP_VISUALBLOCK_CREATE_WRITE_BLOCKS'
export class TVisualBlocks{
    constructor(ProjectId){
       // LOG.nlog('ProjectId');
        this.ProjectId = ProjectId;
       // LOG.nlog('this.ProjectId');
        this.blocks = this.GetProjectDataMainBlocks();
       // LOG.nlog('this.GetProjectDataMainBlocks()');
    }
    GetProjectDataMainBlocks(){
      return new TVisualBlocksCreateTmp(this.ProjectId);
    }
    ReGetVisualBlocks(){
      this.blocks = this.GetProjectDataMainBlocks();
    }
    GetCurrentBlocks(){
      return this.blocks;
    }
    //поправить костыль с мультиблоками и мультистроками
    //не изменять используется в внешнем скрипте
    SetValueByIds(val,VisualBlockId,BlockLineId,FieldId){
      // LOG.log(VisualBlockId,'VisualBlockId')
      //  LOG.log(BlockLineId,'BlockLineId')
      //   LOG.log(FieldId,'FieldId')
      //LOG.log(this.blocks,'this.blocks')
      let multiblock = false;
      let multistr = false;
      let indexblock = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
     // LOG.log(indexblock,'indexblock');
      //LOG.log(indexblock,'indexblock')
      let block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
   //   LOG.log(block,'block')
      if(block.Lines == null){
        if(block.Block != null){
          block = block.Block[0];
          //LOG.log(block,'block0');
          multiblock = true;
        }
      }
      let indexline  = REST.FindIndexInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
     // LOG.log(indexline,'indexline');
      //LOG.log(indexline,'indexline')
      let line = REST.FindInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
      //LOG.log(line,'line')
      let indexfild = REST.FindIndexInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      //LOG.log(indexfild,'indexfild')
      let field = REST.FindInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      //LOG.log(field,'field')
      if (multiblock && !multistr){
       // LOG.log('multiblock');
        this.blocks[indexblock].Block[0].Lines[indexline].Fields[indexfild].Val = val;
      }else{
        this.blocks[indexblock].Lines[indexline].Fields[indexfild].Val = val;
      }
    }
/*
    SetValueByIndex(val,VisualBlockIndex,BlockLineIndex,FieldIndex){
      this.blocks[VisualBlockIndex].Lines[BlockLineIndex].Fields[FieldIndex].Val = val;
    }
*/
	  GetValueByIds(VisualBlockId,BlockLineId,FieldId){
      let block;
      if(this.blocks != null){
        block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId').Lines;
        if(block == null){
           block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId').Block[0].Lines;
        }else{
          let lines = REST.FindInArrayObjectsByKeyValue(block,BlockLineId,'BlockLineId').Fields;
          if (lines != null){
            return REST.FindInArrayObjectsByKeyValue(lines,FieldId,'Id').Val;
          }else{
            let res = [];
            lines = REST.FindInArrayObjectsByKeyValue(block,BlockLineId,'BlockLineId').Lines;
            lines.forEach(item => {
              res.push(REST.FindInArrayObjectsByKeyValue(item.Fields,FieldId,'Id').Val);
            });
            return res;
          }
        }
      }
    }
    /*
      Field может принимать значения имя,ID,индекс
      BlockLine может принимать значения BlockLineId,индекс,null
      VisualBlock может принимать значения имя,VisualBlockId,индекс,null
    */
    //не изменять используется в внешнем скрипте
    SetValue(Val,Field = null,BlockLine = null,VisualBlock=null){
      let path = this.GetPath(Field,BlockLine,VisualBlock);
      LOG.log(path,'path')
      if(path != null){
         this.SetValueByIds(Val,path.VisualBlockId,path.BlockLineId,path.Id);
      }
    }
    /*
      Field может принимать значения имя,ID,индекс
      BlockLine может принимать значения BlockLineId,индекс,null
      VisualBlock может принимать значения имя,VisualBlockId,индекс,null
    */
    //не изменять используется в внешнем скрипте
    GetValue(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      let res = null;
      if(Field != null){
        this.typeField = this._GetValueType(Field);
        if (this.typeField != null){
          let lines  = null;
          let fields = null;
          this.typeBlock = this._GetValueType(VisualBlock);
          this.typeLine  = this._GetValueType(BlockLine);
          this.FieldVal = Field;
          this.BlockLineVal = BlockLine;
          this.VisualBlockVal = VisualBlock;
          res = this._GetLinesByTypeBlock(Path);
        }
      }
      LOG.log(res,'res');
     // LOG.log(this.blocks,'this.blocks');
      return res;
    }
    /*
      Field может принимать значения имя,ID,индекс
      BlockLine может принимать значения BlockLineId,индекс,null
      VisualBlock может принимать значения имя,VisualBlockId,индекс,null
    */
    //не изменять используется в внешнем скрипте
    GetPath(Field = null,BlockLine = null,VisualBlock=null){
       return this.GetValue(Field,BlockLine,VisualBlock,true)
    }
    _GetFieldsByNull(lines,Path){
      let res = {Miulti:false,Fields:null};
      for (let i = 0;i < lines.length;i++){
        res.Miulti = false;
     //   LOG.log('_GetFieldsByNull--');
        let field = lines[i].Fields;
        if(field == null){
          field = lines[i].Lines;
          res.Miulti = true;
        }
        res.Fields = field;
        let _res = this._GetValueByTypeFields(res,Path);
      //  LOG.log(_res,'_GetFieldsByNull');
        if(_res.Find){
          if(Path){
        //     LOG.log(lines[i].BlockLineId,'_GetFieldsByNull++');
            _res.Val.BlockLineId  = lines[i].BlockLineId;
          }
          return _res;
        }
      }
      return {Find:false};
    }
//поправить костыль с мультиблоками и мультистроками
    _GetLinesByNull(Path){
      for (let i = 0;i < this.blocks.length;i++){
        let item = this.blocks[i];
        let _res
        if(item.Lines != null){
           _res = this._GetFieldsByTypeLine(item.Lines,Path);
        }else{
           _res = this._GetFieldsByTypeLine(item.Block[0].Lines,Path);
        }
        if(_res.Find){
          if(Path){
            _res.Val.VisualBlockId  = item.VisualBlockId;
          }
          return _res.Val;
        }
      }
      return null;
    }
    __GetValueByTypeFields(fields,Path){
      let res = {Val:null,Find:false}
      let item = null;
      if(this.typeField == 'id')   {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Id');}
      if(this.typeField == 'index'){item = fields[this.FieldVal];}
      if(this.typeField == 'name') {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Name');}
      if(REST.IsObjectNotEmpitly(item)){
        res.Find = true;
       // LOG.log(Path,'__GetValueByTypeFieldsPath')
        if(Path){
          res.Val = {Id:item.Id}
        }else{
          res.Val = item.Val;
        }
      }else{
        res.Find = false;
      }
     // LOG.log(res,'__GetValueByTypeFields')
      return res;
    }
    _GetValueByTypeFields(fields,Path){
      let res = {Val:null,Find:false};
      let _res = null;
      if(fields.Fields != null){
        if(fields.Miulti){
          let arr = [];
       //   LOG.log(fields,'fields')
        //  if(fields.Fields != null){
          fields.Fields.forEach(item => {
            let _i = this.__GetValueByTypeFields(item.Fields,Path);
            if(_i.Find){
              if(!Path){
                arr.push(_i.Val);
              }else{
                _res =  _i.Val;
              }
              res.Find = true;
            }else{
              res.Find = false;
            }
          });
        // }
          if(!Path){
          _res = arr;
          }
        }else{
          let _f = this.__GetValueByTypeFields(fields.Fields,Path);
          if(_f.Find){
            res.Find = true;
            _res = _f.Val;
          }else{
            res.Find = false;
          }
        }
        res.Val = _res;
      }
    //  LOG.log(res,'_GetValueByTypeFields');
      return res;
    }
    _GetFieldsByTypeLine(line,Path){
      let res = {Miulti:false,Fields:null};
      let fields = null;
      res.Miulti = false;
      let item = {};
      if(this.typeLine == 'id')   {
        item = REST.FindInArrayObjectsByKeyValue(line,this.BlockLineVal,'BlockLineId');
        fields = item.Fields;
        if(fields == null){
          fields = item.Lines;
          res.Miulti = true
        }
      }
      if(this.typeLine == 'index'){
        item = line[BlockLineVal];
        fields = item.Fields;
        if(fields == null){
          fields = item.Lines;
          res.Miulti = true
        }
      }
      if(this.typeLine == null){
        return this._GetFieldsByNull(line,Path);
      }
      if(fields != null){
        res.Fields = fields;
      }else{
        return {Find:false}
      }
      let rs = this._GetValueByTypeFields(res,Path);
      if (Path){
        rs.Val.BlockLineId = item.BlockLineId;
      }
    //  LOG.log(rs,'rs')
      return rs;
    }
//поправить костыль с мультиблоками и мультистроками
    _GetLinesByTypeBlock(Path){
      let lines = null;
      let item = {};
      let ret;
      if(this.typeBlock == null){return this._GetLinesByNull(Path)}
      if(this.typeBlock == 'id')   {
        item = REST.FindInArrayObjectsByKeyValue(this.blocks,this.VisualBlockVal,'VisualBlockId');
      }
      if(this.typeBlock == 'index'){
        item = this.blocks[this.VisualBlockVal];
      }
      if(this.typeBlock == 'name') {
        item = REST.FindInArrayObjectsByKeyValueSub(this.blocks,this.VisualBlockVal,'Name');
      }
      if (item.Lines != null){
        lines = item.Lines;
        ret = this._GetFieldsByTypeLine(lines,Path).Val;
      }else{
        let bl = item.Block;
     //   LOG.log(bl,'bl');
        if(bl != null){
          ret = this._GetFieldsByTypeLine(bl[0].Lines,Path).Val;
        }
      }
   //   LOG.log(ret,'_GetLinesByTypeBlock');
      if (Path){
        ret.VisualBlockId = item.VisualBlockId;
      }
      return ret;
    }
    _GetValueType(val){
      if (REST.IsStringGUID(val)){
        return 'id';
      }else {
        if (REST.IsString(val)){
          return 'name';
        }else{
            if(REST.IsNumber(val)){
              return 'index'
            }
        }
      }
      return null;
    }
/*
    GetValueByIndex(VisualBlockIndex,BlockLineIndex,FieldIndex){
      if(this.blocks != null){
        let res = {};
        res.Val =  this.blocks[VisualBlockIndex].Lines[BlockLineIndex].Fields[FieldIndex].Val;
        res.Id  =  this.blocks[VisualBlockIndex].Lines[BlockLineIndex].Fields[FieldIndex].Id;
        res.BlockLineId  =  this.blocks[VisualBlockIndex].Lines[BlockLineIndex].BlockLineId;
        res.VisualBlockId  =  this.blocks[VisualBlockIndex].VisualBlockId;
        return res;
      }
      return null;
    }
*/
    GetUpdate(){
      this._GetUpdate();
      return this.UpdateVisualBlock;
    }
    _GetUpdate(){
      this.UpdateVisualBlock = new TVisualBlocksCreateWrite(this.blocks);
    }
    _FindArrayValuesIdFromBlockValueId(Values,BlockValuesId){
      if (Values != null){
          return REST.FindArrayInArrayObjectsByKeyValue(Values,BlockValuesId,'VisualBlockProjectFieldId').Value;
      }
      return null;
    }
    _GETAll(){
        return AJAX.GET(`/api/ProjectCustomValues/GetAllVisualBlocks?ProjectId=${this.ProjectId}`);
    }
}