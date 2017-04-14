var path = require('path');
var fs = require('fs')
var _ = require('lodash');
var isDirSync = require('./directory_exists_sync');

var getEntries = function(searchPath, additionalPath = "") {

    var entriesObject = {};

    if(isDirSync(path.join(searchPath, additionalPath))) {
        var files = fs.readdirSync(path.join(searchPath, additionalPath));
        files.forEach(item => {
            prefix = (additionalPath == "") ? "" : additionalPath + "/" ;
            if(isDirSync(path.join(searchPath, additionalPath, item))) {
                entriesObject = _.merge(entriesObject, getEntries(searchPath, prefix + item));
            }

            if(item.includes('.js')) { // we only care about files that contain .js in their name
                entry_name = prefix + item.replace( /\.js([6x])?$/, "");
                entriesObject[entry_name] = './entry/' + prefix + item;
            }

        });
    }

    return entriesObject;
}

module.exports = getEntries;