/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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


