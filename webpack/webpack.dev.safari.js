const CopyPlugin = require("copy-webpack-plugin");
const common = require('./webpack.common.js');

module.exports = common('safari', 'development');