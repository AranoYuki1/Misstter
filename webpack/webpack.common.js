const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = (browser_name, mode) => {
    const common = {
        entry: {
          popup: path.join(srcDir, 'popup/Popup.tsx'),
          content_script: path.join(srcDir, 'content_script/contents.ts'),
          background: path.join(srcDir, 'background/background.ts'),
        },

        output: {
            path: path.join(__dirname, `../dist/${browser_name}/js`),
            filename: "[name].js",
        },    

        optimization: {
            splitChunks: {
                name: "vendor",
                chunks(chunk) {
                  return chunk.name !== 'background';
                }
            },
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },

        plugins: [
            new CopyPlugin({
                patterns: [{ from: ".", to: "../", context: "public" }],
                options: {},
            }),
            new CopyPlugin({
                patterns: [{ from: "./manifest.json", to: "../manifest.json", context: `browser/${browser_name}` }],
                options: {},
            })
        ],
    };

    if (mode == "development") {
        return {
            ...common,
            devtool: 'inline-source-map',
            mode: 'development'
        }
    } else if (mode == "production") {
        return {
            ...common,
            mode: 'production'
        }
    }
}