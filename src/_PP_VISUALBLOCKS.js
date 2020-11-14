/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//поправить костыль с мультиблоками и мультистроками
import * as AJAX from '_PP_AJAX';
import * as LOG from '_PP_LOG';
import * as REST from '_PP_REST';
import {TVisualBlocksCreateTmp}   from '_PP_VISUALBLOCK_CREATE_TEMP_STRUCT'
import {TVisualBlocksCreateWrite} from '_PP_VISUALBLOCK_CREATE_WRITE_BLOCKS'
export class TVisualBlocks{
    constructor(ProjectId){
       // LOG.nlog('ProjectId');
        this.ProjectId = ProjectId;
       // LOG.nlog('this.ProjectId');
        this.blocks = this.GetProjectDataMainBlocks();
       // LOG.nlog('this.GetProjectDataMainBlocks()');
    }
    GetProjectDataMainBlocks(){
      return new TVisualBlocksCreateTmp(this.ProjectId);
    }
    ReGetVisualBlocks(){
      this.blocks = this.GetProjectDataMainBlocks();
    }
    GetCurrentBlocks(){
      return this.blocks;
    }
    //поправить костыль с мультиблоками и мультистроками
    //не изменять используется в внешнем скрипте
    SetValueByIds(val,VisualBlockId,BlockLineId,FieldId){
      // LOG.log(VisualBlockId,'VisualBlockId')
      //  LOG.log(BlockLineId,'BlockLineId')
      //   LOG.log(FieldId,'FieldId')
      //LOG.log(this.blocks,'this.blocks')
      let multiblock = false;
      let multistr = false;
      let indexblock = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
     // LOG.log(indexblock,'indexblock');
      //LOG.log(indexblock,'indexblock')
      let block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
   //   LOG.log(block,'block')
      if(block.Lines == null){
        if(block.Block != null){
          block = block.Block[0];
          //LOG.log(block,'block0');
          multiblock = true;
        }
      }
      let indexline  = REST.FindIndexInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
     // LOG.log(indexline,'indexline');
      //LOG.log(indexline,'indexline')
      let line = REST.FindInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
      //LOG.log(line,'line')
      let indexfild = REST.FindIndexInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      //LOG.log(indexfild,'indexfild')
      let field = REST.FindInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      //LOG.log(field,'field')
      if (multiblock && !multistr){
       // LOG.log('multiblock');
        this.blocks[indexblock].Block[0].Lines[indexline].Fields[indexfild].Val = val;
      }else{
        this.blocks[indexblock].Lines[indexline].Fields[indexfild].Val = val;
      }
    }
/*
    SetValueByIndex(val,VisualBlockIndex,BlockLineIndex,FieldIndex){
      this.blocks[VisualBlockIndex].Lines[BlockLineIndex].Fields[FieldIndex].Val = val;
    }
*/
	  GetValueByIds(VisualBlockId,BlockLineId,FieldId){
      let block;
      if(this.blocks != null){
        block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId').Lines;
        if(block == null){
           block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId').Block[0].Lines;
        }else{
          let lines = REST.FindInArrayObjectsByKeyValue(block,BlockLineId,'BlockLineId').Fields;
          if (lines != null){
            return REST.FindInArrayObjectsByKeyValue(lines,FieldId,'Id').Val;
          }else{
            let res = [];
            lines = REST.FindInArrayObjectsByKeyValue(block,BlockLineId,'BlockLineId').Lines;
            lines.forEach(item => {
              res.push(REST.FindInArrayObjectsByKeyValue(item.Fields,FieldId,'Id').Val);
            });
            return res;
          }
        }
      }
    }
    /*
      Field может принимать значения имя,ID,индекс
      BlockLine может принимать значения BlockLineId,индекс,null
      VisualBlock может принимать значения имя,VisualBlockId,индекс,null
    */
    //не изменять используется в внешнем скрипте
    SetValue(Val,Field = null,BlockLine = null,VisualBlock=null){
      let path = this.GetPath(Field,BlockLine,VisualBlock);
      LOG.log(path,'path')
      if(path != null){
         this.SetValueByIds(Val,path.VisualBlockId,path.BlockLineId,path.Id);
      }
    }
    /*
      Field может принимать значения имя,ID,индекс
      BlockLine может принимать значения BlockLineId,индекс,null
      VisualBlock может принимать значения имя,VisualBlockId,индекс,null
    */
    //не изменять используется в внешнем скрипте
    GetValue(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      let res = null;
      if(Field != null){
        this.typeField = this._GetValueType(Field);
        if (this.typeField != null){
          let lines  = null;
          let fields = null;
          this.typeBlock = this._GetValueType(VisualBlock);
          this.typeLine  = this._GetValueType(BlockLine);
          this.FieldVal = Field;
          this.BlockLineVal = BlockLine;
          this.VisualBlockVal = VisualBlock;
          res = this._GetLinesByTypeBlock(Path);
        }
      }
      LOG.log(res,'res');
     // LOG.log(this.blocks,'this.blocks');
      return res;
    }
    /*
      Field может принимать значения имя,ID,индекс
      BlockLine может принимать значения BlockLineId,индекс,null
      VisualBlock может принимать значения имя,VisualBlockId,индекс,null
    */
    //не изменять используется в внешнем скрипте
    GetPath(Field = null,BlockLine = null,VisualBlock=null){
       return this.GetValue(Field,BlockLine,VisualBlock,true)
    }
    _GetFieldsByNull(lines,Path){
      let res = {Miulti:false,Fields:null};
      for (let i = 0;i < lines.length;i++){
        res.Miulti = false;
     //   LOG.log('_GetFieldsByNull--');
        let field = lines[i].Fields;
        if(field == null){
          field = lines[i].Lines;
          res.Miulti = true;
        }
        res.Fields = field;
        let _res = this._GetValueByTypeFields(res,Path);
      //  LOG.log(_res,'_GetFieldsByNull');
        if(_res.Find){
          if(Path){
        //     LOG.log(lines[i].BlockLineId,'_GetFieldsByNull++');
            _res.Val.BlockLineId  = lines[i].BlockLineId;
          }
          return _res;
        }
      }
      return {Find:false};
    }
//поправить костыль с мультиблоками и мультистроками
    _GetLinesByNull(Path){
      for (let i = 0;i < this.blocks.length;i++){
        let item = this.blocks[i];
        let _res
        if(item.Lines != null){
           _res = this._GetFieldsByTypeLine(item.Lines,Path);
        }else{
           _res = this._GetFieldsByTypeLine(item.Block[0].Lines,Path);
        }
        if(_res.Find){
          if(Path){
            _res.Val.VisualBlockId  = item.VisualBlockId;
          }
          return _res.Val;
        }
      }
      return null;
    }
    __GetValueByTypeFields(fields,Path){
      let res = {Val:null,Find:false}
      let item = null;
      if(this.typeField == 'id')   {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Id');}
      if(this.typeField == 'index'){item = fields[this.FieldVal];}
      if(this.typeField == 'name') {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Name');}
      if(REST.IsObjectNotEmpitly(item)){
        res.Find = true;
       // LOG.log(Path,'__GetValueByTypeFieldsPath')
        if(Path){
          res.Val = {Id:item.Id}
        }else{
          res.Val = item.Val;
        }
      }else{
        res.Find = false;
      }
     // LOG.log(res,'__GetValueByTypeFields')
      return res;
    }
    _GetValueByTypeFields(fields,Path){
      let res = {Val:null,Find:false};
      let _res = null;
      if(fields.Fields != null){
        if(fields.Miulti){
          let arr = [];
       //   LOG.log(fields,'fields')
        //  if(fields.Fields != null){
          fields.Fields.forEach(item => {
            let _i = this.__GetValueByTypeFields(item.Fields,Path);
            if(_i.Find){
              if(!Path){
                arr.push(_i.Val);
              }else{
                _res =  _i.Val;
              }
              res.Find = true;
            }else{
              res.Find = false;
            }
          });
        // }
          if(!Path){
          _res = arr;
          }
        }else{
          let _f = this.__GetValueByTypeFields(fields.Fields,Path);
          if(_f.Find){
            res.Find = true;
            _res = _f.Val;
          }else{
            res.Find = false;
          }
        }
        res.Val = _res;
      }
    //  LOG.log(res,'_GetValueByTypeFields');
      return res;
    }
    _GetFieldsByTypeLine(line,Path){
      let res = {Miulti:false,Fields:null};
      let fields = null;
      res.Miulti = false;
      let item = {};
      if(this.typeLine == 'id')   {
        item = REST.FindInArrayObjectsByKeyValue(line,this.BlockLineVal,'BlockLineId');
        fields = item.Fields;
        if(fields == null){
          fields = item.Lines;
          res.Miulti = true
        }
      }
      if(this.typeLine == 'index'){
        item = line[BlockLineVal];
        fields = item.Fields;
        if(fields == null){
          fields = item.Lines;
          res.Miulti = true
        }
      }
      if(this.typeLine == null){
        return this._GetFieldsByNull(line,Path);
      }
      if(fields != null){
        res.Fields = fields;
      }else{
        return {Find:false}
      }
      let rs = this._GetValueByTypeFields(res,Path);
      if (Path){
        rs.Val.BlockLineId = item.BlockLineId;
      }
    //  LOG.log(rs,'rs')
      return rs;
    }
//поправить костыль с мультиблоками и мультистроками
    _GetLinesByTypeBlock(Path){
      let lines = null;
      let item = {};
      let ret;
      if(this.typeBlock == null){return this._GetLinesByNull(Path)}
      if(this.typeBlock == 'id')   {
        item = REST.FindInArrayObjectsByKeyValue(this.blocks,this.VisualBlockVal,'VisualBlockId');
      }
      if(this.typeBlock == 'index'){
        item = this.blocks[this.VisualBlockVal];
      }
      if(this.typeBlock == 'name') {
        item = REST.FindInArrayObjectsByKeyValueSub(this.blocks,this.VisualBlockVal,'Name');
      }
      if (item.Lines != null){
        lines = item.Lines;
        ret = this._GetFieldsByTypeLine(lines,Path).Val;
      }else{
        let bl = item.Block;
     //   LOG.log(bl,'bl');
        if(bl != null){
          ret = this._GetFieldsByTypeLine(bl[0].Lines,Path).Val;
        }
      }
   //   LOG.log(ret,'_GetLinesByTypeBlock');
      if (Path){
        ret.VisualBlockId = item.VisualBlockId;
      }
      return ret;
    }
    _GetValueType(val){
      if (REST.IsStringGUID(val)){
        return 'id';
      }else {
        if (REST.IsString(val)){
          return 'name';
        }else{
            if(REST.IsNumber(val)){
              return 'index'
            }
        }
      }
      return null;
    }
/*
    GetValueByIndex(VisualBlockIndex,BlockLineIndex,FieldIndex){
      if(this.blocks != null){
        let res = {};
        res.Val =  this.blocks[VisualBlockIndex].Lines[BlockLineIndex].Fields[FieldIndex].Val;
        res.Id  =  this.blocks[VisualBlockIndex].Lines[BlockLineIndex].Fields[FieldIndex].Id;
        res.BlockLineId  =  this.blocks[VisualBlockIndex].Lines[BlockLineIndex].BlockLineId;
        res.VisualBlockId  =  this.blocks[VisualBlockIndex].VisualBlockId;
        return res;
      }
      return null;
    }
*/
    GetUpdate(){
      this._GetUpdate();
      return this.UpdateVisualBlock;
    }
    _GetUpdate(){
      this.UpdateVisualBlock = new TVisualBlocksCreateWrite(this.blocks);
    }
    _FindArrayValuesIdFromBlockValueId(Values,BlockValuesId){
      if (Values != null){
          return REST.FindArrayInArrayObjectsByKeyValue(Values,BlockValuesId,'VisualBlockProjectFieldId').Value;
      }
      return null;
    }
    _GETAll(){
        return AJAX.GET(`/api/ProjectCustomValues/GetAllVisualBlocks?ProjectId=${this.ProjectId}`);
    }
}
