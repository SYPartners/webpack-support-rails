var makeEntryMap = function (entryList, entry_path) {
    var entries = {};

    entryList.forEach(entry => {
        var entry_key = entry.replace( /\.js([6x])?$/, "").replace( entry_path + '/', "");
        var entry_value = './entry' + entry.replace( entry_path, "");
        entries[entry_key] = entry_value;
    });

    return entries;
}

module.exports = makeEntryMap;