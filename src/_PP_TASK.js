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




