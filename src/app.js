// write your code
import database from './json/exam-databse.json';
function findId(prop, type) {
    const orginalId = prop.split(type)[1];
    if(type === '__'){
        return {
            id: orginalId,
            start: prop,
            end: '_#' + orginalId
        }
    }else {
        return {
            id: orginalId,
            end: prop,
            start: '__' + orginalId
        }
    }
    
}


// isStart 
function isStartDivider(prop) {
    let result = false;
    if(typeof prop === 'string' && prop.startsWith('__')){
        result = true;
        for (const obj of database) {
            const {id, end} = findId(prop, '__');
            if(obj.hasOwnProperty(end) && !obj.hasOwnProperty(id)){
                result = true;
            }
        }
    }
   return result;
    
}

function isEndDivider(prop) {
    let result = false;
    if(typeof prop === 'string' && prop.startsWith('_#')){
        result = true;
        for (const obj of database) {
            const {id, start} = findId(prop, '_#');
            if(obj.hasOwnProperty(start) && !obj.hasOwnProperty(id)){
                result = true;
            }
        }
    }
    return result;
}

// queue

const queue = [];
const data = {};

// database element loop
for (let obj of database) {
    for (let property in obj) {
        const isStart = isStartDivider(property);
        const isEnd = isEndDivider(property);
        let canUse = true;
        if(isStart){
            const {id} = findId(property, '__');
            queue.push(id);
            canUse = false;
        }
        if(isEnd){
            const {id} = findId(property, '_#');
            const indexID = queue.indexOf(id);
            queue.splice(indexID, 1)
            canUse = false;
        }
        let endpoint = data;
        
        for(let scope of queue){
            if(!Reflect.has(endpoint, scope)){
                endpoint[scope] = {};
            }
            endpoint = endpoint[scope];
        }
        if(canUse){
            endpoint[property] = obj[property];
        }
    }
}
console.log(data);