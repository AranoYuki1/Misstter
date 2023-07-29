const common = require('./webpack.common.js');

const defaultConfig = common('safari', 'production');

defaultConfig.plugins.push(
  new CopyPlugin({
    patterns: [{ from: "./icons/", to: "../icons/", context: `browser/safari` }],
    options: {},
  }),
);

module.exports = defaultConfig