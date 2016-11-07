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

module.exports = {
    apply: function (compiler) {
        var build_path = compiler.options.output.path;
        compiler.plugin("compilation", function(compilation, params) {
            compilation.plugin("chunk-asset", function(module, filename) {
                filename = path.join(build_path, filename);
                var template = filename.replace(module['renderedHash'], '*') + '*';

                var files = glob.sync(template)
                remove(files, filename);

                _.each(files, function(file) {
                    fs.unlinkSync(file);
                });
            });
        });
    }
};