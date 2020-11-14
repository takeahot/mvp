/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import {IsString} from '_PP_IS_'
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
export function FindInArrayObjectsByKeyValue(array,value,key){
  let res = {};
  array.forEach(item => {
     if (item[key] == value){
       res = item;
       return;
     }
  });
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


