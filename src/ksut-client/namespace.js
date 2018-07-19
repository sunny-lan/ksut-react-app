export function namespace(space, name) {
    return space+':'+name;
}

export function getNamespace(namespaced) {
    return namespaced.substring(0, namespaced.indexOf(':'));
}

export function getName(namespaced) {
    return namespaced.substring(namespaced.indexOf(':') + 1);
}