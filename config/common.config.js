var path = require('path');
var _ = require('lodash');
var fs = require('fs')
var isDirSync = require('./../lib/directory_exists_sync');

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
var entries = {};
var entry_path = path.join(rails_path, 'app', 'assets', 'javascripts', 'entry');
if(isDirSync(entry_path)) {
    var files = fs.readdirSync(entry_path);
        files.forEach(item => {
            if(item.includes('.js')) { // we only care about files that contain .js in their name
                entry_name = item.replace( /\.js([6x])?$/, "");
                entries[entry_name] = './entry/' + item;
            }
        });
}
// end

var config = {
    context: src_path,
    entry: entries
};

config = _.merge(config, {
    debug: true,
    displayErrorDetails: true,
    outputPathinfo: true
});

config.output = {
    path: build_path,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[id]-[chunkhash].js',
};

config.resolve = {
    root: src_path,
    extensions: ['', '.js', '.js6', '.jsx', '.json'],
    alias: {
        underscore: 'lodash',
    }
};

config.plugins = [
    cleaner,
    new asset_map_writer(asset_map_path),
    new webpack.optimize.CommonsChunkPlugin('common', 'common-[chunkhash].js'),
    new chunk_manifest({ filename: '../webpack-chunk-manifest.json', manfiestVariable: 'webpackBundleManifest' }),
    // new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery",
    // })
];

config.module = {
    loaders: [
        // { test: /\.vue$/, loader: 'vue' },
        { test: /\.js([6x])?$/, exclude: /node_modules/, loader: "babel", query: {presets: ['es2015'] } },
        { include: /\.json$/, loaders: ["json-loader"] }
    ]
};

var custom_config;
try {
    custom_config = require(custom_common_config_path);
    _.mergeWith(config, custom_config, function(objValue, srcValue) { // customizer that will merge arrays with concat instead of overwriting same keys
        if (lodash.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    });
} catch (e) {}

module.exports = config;