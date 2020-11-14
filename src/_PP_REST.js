/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



import * as LOG from '_PP_LOG'
export function TimeShtampToDateTime(timestamp){
  let date = new Date();
  //nlog(String(timestamp));
  date.setTime(timestamp*1000);
  return date.toISOString();
}
export function GetEmpitlyDate(){
  let date = new Date();
  date.setTime(0);
  return date.toISOString();
}
export function SetZeroTime(val){
  let res = new Date(val);
  res =  res.toISOString().substr(0,11) + '00:00:00.000Z';
  LOG.log(res,'SetZeroTime');
 /* res.setMilliseconds(0);
  res.setSeconds(0);
  res.setMinutes(0);
  res.setHours(0) ;*/
  return res;
}
export function sleep(sec) {
  let t = Date.now();
  let s = sec * 1000;
  let i = 0;
  while ((Date.now() - t) < s) {
      i++;
  }
}
export function ObjToArray(obj){
	Arr = [];
	for (let key in obj){
    Arr.push(obj[key])
	}
	return Arr;
}
export function fioToFIOArray(fio){
  let s = fio.trim();
  s = s.split(' ');
  let res = []
  s.forEach(item => {
    if(item != ''){
      res.push(item);
    }
  });
  return res;
}
export function ArrayTofio(FIO){
  let fio = '';
  fio = ((FIO[0] === undefined) ? '' : FIO[0])  + ' ' + ((FIO[1] === undefined) ? '' : FIO[1]) + ' ' + ((FIO[2] === undefined) ? '': FIO[2]);
  fio = fio.trim();
  return fio
}
export function IsObjectEmpitly(obj){
  if (IsObject(obj)){
    if (obj == null) return true;
    return Object.keys(obj).length == 0
  }
  return true;
}
export function IsObjectNotEmpitly(obj){
  if (IsObject(obj)){
    if (obj == null) return false;
    return Object.keys(obj).length > 0
  }
  return false;
}
export function IsStringGUID(val){
  if (IsString(val)){
    let arr = val.split('-');
    if(arr.length == 5 && arr[0].length == 8 && arr[4].length == 12 && arr[1].length == 4 && arr[2].length == 4 && arr[3].length == 4   ){
      return true;
    }
    return false;
  }
  return false;
}
export function IsNotStringGUID(val){
  if (IsString(val)){
    let arr = val.split('-');
    if(arr.length == 5 && arr[0].length == 8 && arr[4].length == 12 && arr[1].length == 4 && arr[2].length == 4 && arr[3].length == 4   ){
      return false;
    }
    return true;
  }
  return false;
}
export function IsUndefined(val){
  return typeof val == 'undefined'
}
export function IsNumber(val){
  return typeof val == 'number'
}
export function IsBoolean(val){
  return typeof val == 'boolean'
}
export function IsString(val){
  return typeof val == 'string'
}
export function IsCharNumber(char){
  if (char === '0' ||char === '1' ||char === '2' ||char === '3' ||char === '4' ||char === '5' ||char === '6' ||char === '7' ||char === '8' ||char === '9')return true;
  return false;
}
export function IsInStringNumberOnly(val){
  if (!IsString(val)) return false;
  for (let i = 0;i<val.length;i++){
    if (!IsCharNumber(val[i])){
      return false;
    }
  }
  return true;
}
export function IsObject(val){
  return typeof val == 'object'
}
export function IsFunction(val){
  return typeof val == 'function'
}
export function IsArray(val){
  if (IsObject(val)){
    return Array.isArray(val)
  }
  return false;
}
export function IsNotUndefined(val){
  return !typeof val == 'undefined'
}
export function IsNotNumber(val){
  return !typeof val == 'number'
}
export function IsNotBoolean(val){
  return !typeof val == 'boolean'
}
export function IsNotString(val){
  return !typeof val == 'string'
}
export function IsNotObject(val){
  return !typeof val == 'object'
}
export function IsNotFunction(val){
  return !typeof val == 'function'
}
export function IsNotArray(val){
  if (IsObject(val)){
    return !Array.isArray(val)
  }
  return true;
}
export function FindInArrayObjectsByKeyValue(array,value,key){
  let res = {};
 // LOG.log(array,'array');
  array.forEach(item => {
     if (item[key] == value){
       res = item;
       return;
     }
  });
  return res;
}
export function FindInArrayObjectsByKeyValueNonCase(array,value,key){
  let res = {};
 // LOG.log(array,'array');
  if(IsString(value)){
    array.forEach(item => {
      if (item[key].toUpperCase() == value.toUpperCase()){
        res = item;
        return;
      }
    });
  }else{
    res = FindInArrayObjectsByKeyValue(array,value,key);
  }
  return res;
}
export function FindInArrayObjectsByKeyValueSub(array,value,key){
  let res = {};
  for (let i = 0;i < array.length;i++){
    if(array[i][key] != null && IsString(array[i][key])){
        if (array[i][key].indexOf(value) != -1){
           return array[i];
        }
    }
  }
}
export function FindArrayInArrayObjectsByKeyValue(array,value,key){
  let res = [];
  array.forEach(item => {
     if (item[key] == value){
       res.push(item);
     }
  });
 // LOG.log(res,'FindArrayInArrayObjectsByKeyValue');
  return res;
}
export function FindIndexInArrayObjectsByKeyValue(array,value,key){
  let res = -1;
  let find = false;
  array.forEach(item => {
     if (!find){
       res++;
     }
     if (item[key] == value){
       find = true;
       return;
     }
  });
  if (find){
    return res;
  }
  return null;
}
//src == dst == {Dim in ['s','m','h','D','M','Y',null]}
//Oper in ['+','-']
export function OperDate(src = {},dst = {},Oper = '+'){
    if(!IsObjectEmpitly(src)&&!IsObjectEmpitly(dst)){
        if(src.Val != null && dst.Val != null){
           if (Oper == '+'){
              return OperDataSumm(src,dst);
           }else
           if (Oper == '-'){
                return OperDataDiff(src,dst);
           }
        }
    }
    return null;
}
function OperDataConvert(val,dim){
  const s = 1000;
  const m = s * 60;
  const h = m * 60;
  const D = h * 24;
  if(dim != null){
     if(dim == 's'){
       return Number(val) * s;
     }else
     if(dim == 'm'){
       return Number(val) * m;
     }else
     if(dim == 'h'){
       return  Number(val) * h;
     }else
     if(dim == 'D'){
       return  Number(val) * D;
     }
  }
  return null;
}
function OperDataSumm(src,dst){
   //let datsrc = new Date(); let datdst = new Date();
   let _src; let _dst;
   if (src.Dim != null && dst.Dim != null){
     let d1 = OperDataConvert(src.Val,src.Dim); let d2 = OperDataConvert(dst.Val,dst.Dim);
     if (d1 != null && d2 != null){
        return d1 + d2;
     }
     return null;
   }else
   if (src.Dim == null && dst.Dim == null){
     return null;
   }else
   if (src.Dim == null){
     _src = src; _dst = dst;
   }else{
     _src = dst; _dst = src;
   }
   let _datsrc = new Date(_src.Val);
   if (_dst.Dim == 'Y'){
        _datsrc.setFullYear(_datsrc.getFullYear() + _dst.Val);
   }else
   if (_dst.Dim == 'M'){
       _datsrc.setMonth(_datsrc.getMonth() + _dst.Val);
   }else
   if (_dst.Dim == 'D'){
       _datsrc.setDate(_datsrc.getDate() + _dst.Val);
   }else
   if (_dst.Dim == 'h'){
       _datsrc.setHours(_datsrc.getHours() + _dst.Val);
   }else
   if (_dst.Dim == 'm'){
       _datsrc.setMinutes(_datsrc.getMinutes() + _dst.Val);
   }else
   if (_dst.Dim == 's'){
       _datsrc.setSeconds(_datsrc.getSeconds() + _dst.Val);
   }
   return _datsrc.toISOString();
}
function OperDataDiff(src,dst){
  // let rd_ = Date.now();
  // let rd = new Date();
  // rd.setTime(rd_);
  // LOG.log(rd.toLocaleString(),'rd');
   //let datsrc = new Date(); let datdst = new Date();
   let _src; let _dst;
   if (src.Dim != null && dst.Dim != null){
     let d1 = OperDataConvert(src.Val,src.Dim); let d2 = OperDataConvert(dst.Val,dst.Dim);
     if (d1 != null && d2 != null){
        let _dat = new Date(data)
        return d1-d2;
     }
     return null;
   }else
   if (src.Dim == null && dst.Dim == null){
     return null;
   }else
   if (src.Dim == null){
     _src = src; _dst = dst;
   }else{
     _src = dst; _dst = src;
   }
   let _datsrc = new Date(_src.Val);
   //LOG.log(_datsrc);
   if (_dst.Dim == 'Y'){
        _datsrc.setFullYear(_datsrc.getFullYear() - _dst.Val);
   }else
   if (_dst.Dim == 'M'){
       _datsrc.setMonth(_datsrc.getMonth() - _dst.Val);
   }else
   if (_dst.Dim == 'D'){
     //  LOG.log(_datsrc.getDate() - _dst.Val,'_datsrc.getDate()');
       _datsrc.setDate(_datsrc.getDate() - _dst.Val);
     // LOG.log(_datsrc.toUTCString(),'_datsrc');
   }else
   if (_dst.Dim == 'h'){
       _datsrc.setHours(_datsrc.getHours() - _dst.Val);
   }else
   if (_dst.Dim == 'm'){
       _datsrc.setMinutes(_datsrc.getMinutes() - _dst.Val);
   }else
   if (_dst.Dim == 's'){
       _datsrc.setSeconds(_datsrc.getSeconds() - _dst.Val);
   }
   //LOG.log(_datsrc,'_datsrc');
   return _datsrc.toISOString();
} 

