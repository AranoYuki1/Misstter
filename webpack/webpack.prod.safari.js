const { merge } = require('webpack-merge');
const common = require('./webpack.common.safari.js');

module.exports = merge(common, {
    mode: 'production'
});