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
export class TVisualBlocksV2{
    constructor(ProjectId){
      this.ProjectId = ProjectId;
      this.blocks    = this.GetProjectDataMainBlocks();
      LOG.log(this.blocks);
    }
    GetProjectDataMainBlocks(){
      return new TVisualBlocksCreateTmp(this.ProjectId);
    }
    GetCurrentBlocks(){
      return this.blocks;
    }
    GetBlock(Param){
      let res = null;
      if(REST.IsStringGUID(Param)){
        res = REST.FindInArrayObjectsByKeyValueSub(this.blocks,Param,'VisualBlockId');
      }else if (REST.IsString(Param)){
        res = REST.FindInArrayObjectsByKeyValueSub(this.blocks,Param,'Name');
      }else if(REST.IsNumber(Param)){
        res = this.blocks[i];
      }
      return res;
    }
    _GetBlockIndex(Param){
      let res = null;
      if(REST.IsStringGUID(Param)){
        res = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,Param,'VisualBlockId');
      }else if (REST.IsString(Param)){
        res = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,Param,'Name');
      }
      return res;
    }
    MoveBlock(Block,Moves){
      let move = this.GetBlock(Moves);
      if(Block.VisualBlockId != null && move != null){
        if (Block.VisualBlockId == move.VisualBlockId){
          let index = this._GetBlockIndex(Moves)
          if (index != null){
            this.blocks.splice(index,1);
            this.blocks.push(Block);
          }
        }
      }
    }
    ClearBlock(Block){
      let index = this._GetBlockIndex(Block);
      if (index != null){
        this.blocks.splice(index,1);
      }
    }
    AddMultiBlock(Block){
      let index = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,Block.VisualBlockId,'VisualBlockId');
      if (index != null){
        if(this.blocks[index].Block != null){
          this.blocks[index].Block.push(Block);
        }
      }
    }
    DeleteMultiBlock(Block,DeleteBlock){
      let index = this._GetBlockIndex(Block);
      if (index != null){
        if(this.blocks[index].Block != null){
          if(REST.IsNumber(DeleteBlock)){
            this.blocks[index].Block.splice(DeleteBlock,1);
          }else if(REST.IsObject(DeleteBlock)){
          }
        }
      }
    }
    //поправить костыль с мультиблоками и мультистроками
    //не изменять используется в внешнем скрипте
    SetValueByIds(val,VisualBlockId,BlockLineId,FieldId){
      let multiblock = false;
      let multistr = false;
      let indexblock = REST.FindIndexInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
      let block = REST.FindInArrayObjectsByKeyValue(this.blocks,VisualBlockId,'VisualBlockId');
      if(block.Lines == null){
        if(block.Block != null){
          block = block.Block[0];
          multiblock = true;
        }
      }
      let indexline  = REST.FindIndexInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
      let line = REST.FindInArrayObjectsByKeyValue(block.Lines,BlockLineId,'BlockLineId');
      if(line.Fields == null){
        if(line.Lines != null){
          line = line.Lines[0];
          multistr = true;
        }
      }
      let indexfild = REST.FindIndexInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      let field = REST.FindInArrayObjectsByKeyValue(line.Fields,FieldId,'Id');
      if (multiblock && !multistr){
        this.blocks[indexblock].Block[0].Lines[indexline].Fields[indexfild].Val = val;
      }else
      if (multiblock && multistr){
        this.blocks[indexblock].Block[0].Lines[indexline].Lines[0].Fields[indexfild].Val = val;
      }else
      if (!multiblock && multistr){
        this.blocks[indexblock].Lines[indexline].Lines[0].Fields[indexfild].Val = val;
      }else{
        this.blocks[indexblock].Lines[indexline].Fields[indexfild].Val = val;
      }
    }
    SetValue(Val,Field = null,BlockLine = null,VisualBlock=null){
      let path = this.GetPath(Field,BlockLine,VisualBlock);
      if(path != null){
         this.SetValueByIds(Val,path.VisualBlockId,path.BlockLineId,path.Id);
      }
    }
    GetValue(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      return this._GetValue(Field,BlockLine,VisualBlock,Path);
    }
    GetValueEx(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      return this._GetValueEx(Field,BlockLine,VisualBlock,Path);
    }
    GetDictonary(Field = null,BlockLine = null,VisualBlock=null,Path = false){
      let res = this._GetValue(Field,BlockLine,VisualBlock,Path);
      if (res != null){
        if(REST.IsArray(Val)){
        }
        return res.dic;
      }
      return null;
    }
    _GetValue(Field = null,BlockLine = null,VisualBlock=null){
      let res = this._GetValueEx(Field,BlockLine,VisualBlock);
      if(res.Find != false){
        let tmp = {};
        if(res.blocks != null){
          tmp.blocks = res.blocks;
          return tmp;
        }else
        if(res.lines != null){
          tmp.lines = res.lines;
          return tmp;
        }else
        if(res.data != null){
          tmp = res.data;
          return tmp;
        }
      }
      return null;
    }
    _GetValueEx(Field = null,BlockLine = null,VisualBlock=null){
      let res = null;
      if(Field != null){
        this.typeField = this._GetValueType(Field);
        if (this.typeField != null){
          this.typeBlock = this._GetValueType(VisualBlock);
          this.typeLine  = this._GetValueType(BlockLine);
          this.FieldVal       = Field;
          this.BlockLineVal   = BlockLine;
          this.VisualBlockVal = VisualBlock;
          res = this._GetLineByBlock(this.blocks);
        }
      }
      return res;
    }
    GetPath(Field = null,BlockLine = null,VisualBlock=null){
      let tmp = this._GetValueEx(Field,BlockLine,VisualBlock);
      if(tmp.Find){
        let path = {};
        path.BlockId = tmp.VisualBlockId;
        path.LineId  = tmp.BlockLineId;
        path.FieldId = tmp.Id;
        return path;
      }
       return null;
    }
    _GetValueByTypeFields(fields = []){
      let res = {}
      let item = null;
      res.Find = false;
      if(this.typeField == 'id')   {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Id');}else
      if(this.typeField == 'index'){item = fields[this.FieldVal];}else
      if(this.typeField == 'name') {item = REST.FindInArrayObjectsByKeyValue(fields,this.FieldVal,'Name');}
      if(REST.IsObjectNotEmpitly(item)){
        res.Find  = true;
        res.Id    = item.Id;
        res.data = item;
      }
      return res;
    }
    _GetFieldsByMultiLine(MulLin = []){
      let res = {}
      let arr = [];
      let tmp = {};
      let itm = null;
      res.Find = false;
      MulLin.forEach(item =>{
        tmp = this._GetValueByTypeFields(item.Fields);
        if (tmp.Find){
          arr.push(tmp.data)
          itm = item;
        }
      });
      if (itm != null){
        //res.BlockLineId = itm.BlockLineId;
        res.lines = arr;
        res.Id = tmp.Id;
        res.Find = true;
      }
      return res;
    }
    _GetFieldsByLine_item(item){
        let res = null;
        let tmp = {};
        if(item.Type == 'Repeated'){
          tmp = this._GetFieldsByMultiLine(item.Lines);
        }else{
          tmp = this._GetValueByTypeFields(item.Fields)
        }
        if(tmp.Find){
          res = tmp;
          res.BlockLineId = item.BlockLineId;
        }
        return res;
      }
    _GetFieldsByLine(line = []){
      let res = {}
      let tmp = {};
      if(this.typeLine == 'id')   {tmp = REST.FindInArrayObjectsByKeyValue(line,this.BlockLineVal,'BlockLineId');}else
      if(this.typeLine == 'index'){tmp = line[this.BlockLineVal];}
      if(REST.IsObjectNotEmpitly(tmp)){
        res = this._GetFieldsByLine_item(tmp);
      }else{
      for(let i = 0;i<line.length;i++){
        res = this._GetFieldsByLine_item(line[i]);
        if(res != null){
          break;
        }
      }}
      if (res == null){
        res = {};
        res.Find = false;
      }
      return res;
    }
    _GetLineByMultiBlock(MBlock = []){
      let res = {}
      let arr = [];
      let tmp = {};
      let itm = null;
      res.Find = false;
      MBlock.forEach(item =>{
        tmp = this._GetFieldsByLine(item.Lines);
        if (tmp.Find){
          arr.push(tmp.lines)
          itm = item;
        }
      });
      if (itm != null){
        res.blocks = arr;
        res.Id = tmp.Id;
        res.BlockLineId =  tmp.BlockLineId;
        res.Find = true;
      }
      return res;
    }
    _GetLinesByBlock_item(item){
        let res = null;
        let tmp = {};
        if(item.Block != null){
          tmp = this._GetLineByMultiBlock(item.Block);
        }else{
          tmp = this._GetFieldsByLine(item.Lines)
        }
        if(tmp.Find){
          res = tmp;
          res.VisualBlockId = item.VisualBlockId;
        }
        return res;
      }
    _GetLineByBlock(block = []){
      let res = {}
      let item = null;
      res.Find = false;
      if(this.typeBlock == 'id')   {item = REST.FindInArrayObjectsByKeyValue(block,this.VisualBlockVal,'Id');}else
      if(this.typeBlock == 'index'){item = block[this.VisualBlockVal];}else
      if(this.typeBlock == 'name') {item = REST.FindInArrayObjectsByKeyValue(block,this.VisualBlockVal,'Name');}
      if(REST.IsObjectNotEmpitly(item)){
        res = this._GetLinesByBlock_item(item);
      }else{
      for(let i = 0;i<block.length;i++){
        res = this._GetLinesByBlock_item(block[i]);
        if(res != null){
          break;
        }
      }}
      if (res == null){
        res = {};
        res.Find = false;
      }
      return res;
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


