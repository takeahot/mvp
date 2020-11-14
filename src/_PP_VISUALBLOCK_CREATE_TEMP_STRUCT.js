/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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


