function InitHash(hashTable, initList) {
    for (const value of initList) {
        hashTable.put(value)
    }
    // console.log("test: ", hashTable.containsKey("Cá voi lưng gù 25 tấn chết do mắc cạn"));
    return hashTable
}

module.exports = InitHash;
