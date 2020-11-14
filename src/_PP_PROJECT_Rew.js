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
    //name, ProjectType, Responsible - required
    //name - string, ProjectType - {Name: ___,SysName: ----, Id: ____}, Responsible: {"Id": "string","Name": "string"}
    Create(name,ProjectType = {},Responsible = {},Folder = {},Group = {}){
        LOG.log(Responsible,'res');
        if (!REST.IsObjectEmpitly(ProjectType) && !REST.IsObjectEmpitly(Responsible)){
           LOG.log(ProjectType,'res');
           if((ProjectType.Id != null || ProjectType.Name != null) && (Responsible.Id != null || Responsible.Name != null)){
              let data = {Name:name,ProjectType:ProjectType,Responsible:Responsible};
	      !Folder.Id ? data : data.Folder.Id = Folder.Id;
	      !Folder.Name ? data : data.Folder.Name = Folder.Name;
	      !Group.Id ? data : data.Group.Id = Group.Id;
	      !Group.Name ? data : data.Group.Name = Group.Name;
	      LOG.log(data,'data');
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
      dat.Blocks = this._VisualBlocksV2.GetUpdate();
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
	//arestov corrected: add {} after if. Don't find time to research properly way correct;
        if (Name) {};
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

