export function get(obj, ...keys) {
    for (let i = 0; i < keys.length; i++) {
        if (obj === undefined)return obj;
        obj = obj[keys[i]];
    }
    return obj;
}