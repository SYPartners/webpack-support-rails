var path = require('path');
var glob = require('glob');
var fs = require('fs');
var _ = require('lodash');

function remove(a, e) {
    var i = a.indexOf(e);
    if (i >= 0) {
        a.splice(i,1);
    }
}

function AssetMapWriter(path) {
    this.path = path;
}

AssetMapWriter.prototype = {
    apply: function (compiler) {
        var path = this.path;

        compiler.plugin("compile", function(params) {
            map = {};
        });

        compiler.plugin("compilation", function(compilation, params) {
            compilation.plugin("chunk-asset", function(module, filename) {
                map[module['name']] = filename;
            });
        });

        compiler.plugin("done", function(params) {
            fs.writeFile(path, JSON.stringify(map, null, 2));
        });
    }
}

module.exports = AssetMapWriter;