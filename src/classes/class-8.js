import databse from './../json/8-database.json';

function isString( prop ) {
    return typeof prop === 'string'
}

function findID( prop, type ) {
    const original_id = prop.split(type)[1];

    if( type === 'start_' ) {
        return {
            id: original_id,
            start: prop,
            end: 'end_' + original_id
        }
    }
    else {
        return {
            id: original_id,
            end: prop,
            start: 'start_' + original_id
        }
    }
    
}

function isDividerStart( prop ) {
    let result = false;
    if( isString( prop ) && prop.startsWith('start_') ) {
        const { id, end } = findID( prop, 'start_' );
        if( databse.hasOwnProperty( end ) && !databse.hasOwnProperty( id ) ) {
            result = true;
        } else {
            console.warn('Something is wrong with ', prop)
        }
    }
    return result;
}

function isDividerEnd( prop ) {
    let result = false;
    if( isString( prop ) && prop.startsWith('end_') ) {
        const { id, start } = findID( prop, 'end_' );
        if( databse.hasOwnProperty( start ) && !databse.hasOwnProperty( id ) ) {
            result = true;
        }else {
            console.warn('Something is wrong with ', prop)
        }
    }
    return result;
}

const queue = [];
const data = {}


for( let property in databse ) {
    const isStart   =  isDividerStart( property );
    const isEnd     =  isDividerEnd( property );
    let canUse      = true;

    if( isStart ) {
       const { id } = findID( property, 'start_' );
       queue.push( id );
       canUse = false;
    }

    if( isEnd ) {
        const { id } = findID( property, 'end_' );
        const ind = queue.indexOf( id );
        queue.splice( ind, 1 );
        canUse = false;
    }

    let endpoint = data;
    for( let scope of queue ) {
        if( !endpoint.hasOwnProperty( scope ) ) {
            endpoint[scope] = {};
        }
        endpoint = endpoint[scope];
    }

    if( canUse ) {
        endpoint[property] = databse[property];
    }
    
}

console.log(data)