/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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


