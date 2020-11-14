/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export function IsObjectEmpitly(obj){
  if (IsObject(obj)){
    if (obj == null) return true;
    return Object.keys(obj).length == 0
  }
  return true;
}
export function IsObjectNotEmpitly(obj){
  return !IsObjectEmpitly(obj);
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
  return !IsStringGUID(val);
}
export function IsUndefined(val){
  return typeof val == 'undefined'
}
export function IsNotUndefined(val){
  return !typeof val == 'undefined'
}
export function IsNumber(val){
  return typeof val == 'number'
}
export function IsNotNumber(val){
  return !typeof val == 'number'
}
export function IsBoolean(val){
  return typeof val == 'boolean'
}
export function IsNotBoolean(val){
  return !typeof val == 'boolean'
}
export function IsString(val){
  return typeof val == 'string'
}
export function IsNotString(val){
  return !typeof val == 'string'
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
export function IsNotObject(val){
  return !typeof val == 'object'
}
export function IsFunction(val){
  return typeof val == 'function'
}
export function IsNotFunction(val){
  return !typeof val == 'function'
}
export function IsArray(val){
  if (IsObject(val)){
    return Array.isArray(val)
  }
  return false;
}
export function IsNotArray(val){
  return !IsArray(val);
}
export function IsArrayEmpitly(val){
  if(IsArray(val)){
    if (val.length != 0){
      return false;
    }
  }
  return true;
}
export function IsArrayNotEmpitly(val){
  return !IsArrayEmpitly(val);
} 


