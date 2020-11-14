/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
//arestov corrected: add {} after if. Don't find time to research properly way correct;
        if (Name) {}
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