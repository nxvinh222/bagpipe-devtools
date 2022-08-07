const getValueByKey = require("../../../utils/objectScan");

function UpdateIdentifierList(hashtable, result, identifierAttr, identifierList) {
    for (let i = 0; i < result.length; i++) {
        let value = getValueByKey(result[i], identifierAttr);
        if (Array.isArray(value)) value = "[" + value.toString() + "]";
        if (!hashtable.containsKey(value)) {
            hashtable.put(value);
            identifierList.push(value);
        }
    }

    var updateRequest = {
        identifier_list: [],
    };
    for (let i = 0; i < identifierList.length; i++) {
        updateRequest.identifier_list.push({
            value: identifierList[i],
        })
    }

    return updateRequest;
}

module.exports = UpdateIdentifierList;
