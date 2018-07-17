export function get(obj, ...keys) {
    for (let i = 0; i < keys.length; i++) {
        if (obj === undefined)return obj;
        obj = obj[keys[i]];
    }
    return obj;
}

export function coalesce(...args){
    for(let i=0;i<args.length;i++)
        if(args[i]!==undefined)
            return args[i];
}

export function wait(delay){
    return new Promise((resolve, reject)=>setTimeout(resolve, delay));
}

export function convertRedisRange(stop){
    if(stop===-1)return undefined;
    return stop+1;
}