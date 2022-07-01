const getValueByKey = require("../../../utils/objectScan");

function UpdateHash(hashtable, result, identifierAttr) {
    for (let i = 0; i < result.length; i++) {
        let value = getValueByKey(result[i], identifierAttr)
        // result[i][identifierAttr]
        if (Array.isArray(value)) value = "[" + value.toString() + "]";
        if (hashtable.containsKey(value)) {
            delete result[i];
        } else {
            hashtable.put(value);
        }
    }

    result = result.filter(function (element) {
        return element !== undefined;
    });
    return [hashtable, result];
}

module.exports = UpdateHash;
