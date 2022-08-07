const getValueByKey = (object, key) => {
    if (Array.isArray(object)) {
        for (const obj of object) {
            const result = getValueByKey(obj, key);
            if (result) {
                return obj[key];
            }
        }
    } else {
        if (object.hasOwnProperty(key)) {
            return object[key];
        }

        for (const k of Object.keys(object)) {
            if (typeof object[k] === "object") {
                const o = getValueByKey(object[k], key);
                if (o !== null && typeof o !== 'undefined')
                    return o;
            }
        }

        return null;
    }
}

module.exports = getValueByKey;