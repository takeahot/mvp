/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


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

