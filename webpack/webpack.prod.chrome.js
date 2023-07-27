const { merge } = require('webpack-merge');
const common = require('./webpack.common.chrome.js');

module.exports = merge(common, {
    mode: 'production'
});