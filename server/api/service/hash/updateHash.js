function UpdateHash(hashtable, result, identifierAttr) {
    for (let i = 0; i < result.length; i++) {
        if (hashtable.containsKey(result[i][identifierAttr])) {
            delete result[i];
        } else {
            hashtable.put(result[i][identifierAttr]);
        }
    }

    result = result.filter(function (element) {
        return element !== undefined;
    });
    return [hashtable, result];
}

module.exports = UpdateHash;
