/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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


