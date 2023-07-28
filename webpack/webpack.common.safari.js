const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");
const common = require("./webpack.common");

module.exports = {
    ...common,
    output: {
        path: path.join(__dirname, "../dist/safari/js"),
        filename: "[name].js",
    },

    plugins: [
        ...common.plugins,
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "browser/safari" }],
            options: {},
        })
    ]
};
