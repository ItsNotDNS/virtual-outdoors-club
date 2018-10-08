const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    resolve: {
        // removes the need to add file extensions to the end of imports
        extensions: ["\0", ".webpack.js", ".web.js", ".js", ".jsx"]
    },
    devServer: {
        // allows React-Router
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]
};
