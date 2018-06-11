function filters(data, names, req) {
    return data.filter(val => {
        let obj = true;
        for (let i = 0, l = names.length; i < l; i++) {
            console.log(Array.isArray(req[names[i]]))
            if (Array.isArray(req[names[i]])) {
                obj = obj && typeof req[names[i]] != "undefined" && (req[names[i]].indexOf('All') + 1 || req[names[i]].indexOf(val[names[i]]) + 1);
                continue;
            }
            obj = obj && typeof req[names[i]] != "undefined" && (req[names[i]] == 'All' || req[names[i]] == val[names[i]]);
        }
        return obj;
    });
}

module.exports.filters = filters;