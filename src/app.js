// write your code

import database from "./json/exam-databse.json";

function findId(prop, type) {
  const orginalId = prop.split(type)[1];
  if (type === "__") {
    return {
      id: orginalId,
      start: prop,
      end: "_#" + orginalId,
    };
  } else {
    return {
      id: orginalId,
      end: prop,
      start: "__" + orginalId,
    };
  }
}

function isString(prop) {
  return typeof prop === "string";
}

function isStartDevider(prop) {
  let result = false;
  for (let obj in prop) {
    if (isString(obj) && obj.startsWith("__")) {
      const { id, end } = findId(obj, "__");
      if (Reflect.has(prop, end) && !Reflect.has(prop, id)) {
        result = true;
      } else {
        console.warn("Someting is wrong " + obj);
      }
    }
  }
  return result;
}

function isEndDevider(prop) {
  let result = false;
  for (let obj in prop) {
    if (isString(obj) && obj.startsWith("_#")) {
      const { id, start } = findId(obj, "_#");
      if (Reflect.has(prop, start) && !Reflect.has(prop, id)) {
        result = true;
      } else {
        console.warn("Someting is wrong " + obj);
      }
    }
  }
  return result;
}

let queue = [];

for (let property of database) {
  for (let isStartProperty in property) {
    const isStart = isStartDevider(property);
    const isEnd = isEndDevider(property);   
    if(isStart){
        const {id} = findId(isStartProperty, "__");
        queue.push(id);
    }
    if(isEnd){
        const {id} = findId(isStartProperty, "_#");
        const indx = queue.indexOf(id);
        queue.splice(indx);
    }
    
  }
  
}

