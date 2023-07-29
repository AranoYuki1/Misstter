const CopyPlugin = require("copy-webpack-plugin");
const common = require('./webpack.common.js');

const defaultConfig = common('safari', 'production');

defaultConfig.plugins.push(
  
);

module.exports = defaultConfig