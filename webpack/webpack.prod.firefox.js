const { merge } = require('webpack-merge');
const common = require('./webpack.common.firefox.js');

module.exports = merge(common, {
    mode: 'production'
});