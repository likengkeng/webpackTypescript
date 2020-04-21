/* eslint-disable */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 存放公共插件
const plugins = [
    // 开发环境和生产环境二者均需要的插件
    new HtmlWebpackPlugin({
      title: 'webpack4 实战',
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'index.html'),
      minify: {
        collapseWhitespace: true
      }
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ $: 'jquery' })
];

// 自动引入dll的文件
const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
files.forEach(file => {
    if(/.*\.dll.js/.test(file)) {
        plugins.push(
            new AddAssetHtmlWebpackPlugin({
                filepath: path.resolve(__dirname, '../dll', file)
            })
        )
    }
    if(/.*\.mainfest.json/.test(file)) {
        plugins.push(
            new webpack.DllReferencePlugin({
                manifest: path.resolve(__dirname, '../dll', file)
            })
        )
    }
})
module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['eslint-loader'],
            },
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: path.resolve(__dirname, '../loaders/replaceLoader.ts'),
                        options: {
                            name: 'hurong test',
                        }
                    }, 
                    { 
                        loader: 'ts-loader'
                    }, 
                    {
                        loader: 'eslint-loader'
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '..', 'dist')
    },
    plugins,
    performance: false,
}