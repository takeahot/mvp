/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
