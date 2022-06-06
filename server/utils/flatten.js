var flattenJSON = (function (isArray, wrapped) {
    return function (table) {
        return reduce("", {}, table);
    };

    function reduce(path, accumulator, table) {
        if (isArray(table)) {
            var length = table.length;

            if (length) {
                // var index = 0;

                // while (index < length) {
                //     var property = path + "[" + index + "]", item = table[index++];
                //     if (wrapped(item) !== item) accumulator[property] = item;
                //     else reduce(property, accumulator, item);
                // }
                if (typeof table[0] === "object") {
                    table = table.map((v) => {
                        return JSON.stringify(v)
                    })
                    accumulator[path] = table.join(",");
                    accumulator[path] = "[" + accumulator[path] + "]"
                } else {
                    accumulator[path] = table.join(",");
                    accumulator[path] = "[" + accumulator[path] + "]"
                }
            } else accumulator[path] = table;
        } else {
            var empty = true;

            if (path) {
                for (var property in table) {
                    // var item = table[property], property = path + "." + property, empty = false;
                    var item = table[property], property = property, empty = false;
                    if (wrapped(item) !== item) accumulator[property] = item;
                    else reduce(property, accumulator, item);
                }
            } else {
                for (var property in table) {
                    var item = table[property], empty = false;
                    if (wrapped(item) !== item) accumulator[property] = item;
                    else reduce(property, accumulator, item);
                }
            }

            if (empty) accumulator[path] = table;
        }

        return accumulator;
    }
}(Array.isArray, Object));

var flatten = function (result) {
    for (var key in result) {
        if (result.hasOwnProperty(key)) {
            let values = result[key].map((value) => {
                return flattenJSON(value);
            })
            result[key] = values;
        }
    }
    return result
}

module.exports = flatten;
