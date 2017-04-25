var path = require('path');
var fs = require('fs')
var isDirSync = require('./directory_exists_sync');

var getEntryList = function (searchPath) {
    var directories = [searchPath];
    var entryList = [];

    while (directories.length != 0) {
        var current_directory = directories.pop();
        var files = fs.readdirSync(current_directory);
        files.forEach(file => {
            if (isDirSync(path.join(current_directory,file))) {
                directories.push(path.join(current_directory,file))
            } else if(file.includes('.js')) {
                entryList.push(path.join(current_directory,file));
            }
        });
    }

    return entryList;
}

module.exports = getEntryList;