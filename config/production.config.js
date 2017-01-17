var config = require('./common.config')
var cleaner = require('./../lib/cleaner');
var webpack = require('webpack');

var uglifyOptions = {
    'compress': {
        'comparisons': false,
        'keep_fargs': true,
        'unsafe': true,
        'unsafe_comps': true,
        'warnings': false
    },
    'mangle': {
        'except': ['define']
    },
    'output': {
        'comments': /^!|@cc_on|@license|@preserve/i,
        'max_line_len': 500,
    }
};

config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyOptions),
    new webpack.optimize.OccurenceOrderPlugin());

module.exports = config;
