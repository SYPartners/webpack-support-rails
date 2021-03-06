var path = require('path');
var _ = require('lodash');
var fs = require('fs')
var getEntryList = require('./../lib/get_entry_list');
var makeEntryMap = require('./../lib/make_entry_map');

var webpack = require('webpack');
var chunk_manifest = require('chunk-manifest-webpack-plugin');

var cleaner = require('./../lib/cleaner');
var asset_map_writer = require('./../lib/asset_map_writer');

var rails_path = process.env.CURRENT_RAILS_ROOT;

var src_path = path.join(rails_path, 'app', 'assets', 'javascripts');
var build_path = path.join(rails_path, 'public', 'assets', 'javascripts');
var asset_map_path = path.join(rails_path, 'public', 'assets', 'asset_map.json');

var custom_common_config_path = path.join(rails_path, 'config', 'webpack', 'common.config.js');

// loop through app/assets/javascripts/entry
// clean me up
var entry_path = path.join(rails_path, 'app', 'assets', 'javascripts', 'entry');
var entries = makeEntryMap(getEntryList(entry_path), entry_path);


var config = {
    context: src_path,
    entry: entries
};

config = _.merge(config, {
    stats: {
        errorDetails: true
    }
});

config.output = {
    pathinfo: true,
    path: build_path,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[id]-[chunkhash].js',
};

config.resolve = {
    modules: [
        src_path,
        "node_modules"
    ],
    extensions: ['.js', '.js6', '.jsx', '.json'],
    alias: {
        underscore: 'lodash',
    }
};

config.plugins = [
    new webpack.LoaderOptionsPlugin({
        debug: true
    }),
    cleaner,
    new asset_map_writer(asset_map_path),
    new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common-[chunkhash].js'}),
    new chunk_manifest({ filename: '../webpack-chunk-manifest.json', manfiestVariable: 'webpackBundleManifest' }),
    // new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery",
    // })
];

config.module = {
    loaders: [
        // { test: /\.vue$/, loader: 'vue' },
        { test: /\.js([6x])?$/, exclude: /node_modules/, loader: "babel-loader", query: {presets: ['es2015'] } },
        { include: /\.json$/, loaders: ["json-loader"] }
    ]
};

var custom_config;
try {
    custom_config = require(custom_common_config_path);
    _.mergeWith(config, custom_config, function(objValue, srcValue) { // customizer that will merge arrays with concat instead of overwriting same keys
        if (_.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    });
} catch (e) {}

module.exports = config;