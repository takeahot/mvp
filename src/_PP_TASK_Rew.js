/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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


