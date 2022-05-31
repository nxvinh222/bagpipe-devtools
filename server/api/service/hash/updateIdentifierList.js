function UpdateIdentifierList(hashtable, result, identifierAttr, identifierList) {
    for (let i = 0; i < result.length; i++) {
        if (!hashtable.containsKey(result[i][identifierAttr])) {
            hashtable.put(result[i][identifierAttr]);
            identifierList.push(result[i][identifierAttr]);
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
