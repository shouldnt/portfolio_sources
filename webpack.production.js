const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
   devtool: 'source-map',
   plugins: [
       new webpack.NamedModulesPlugin(),
       new ExtractTextPlugin("css/build/[name].css"),
   ],
    module: {
        rules: [{
            test: /\.(scss|sass)$/,
            use:ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [{
                    loader: "css-loader", options: {
                        url: false,
                        sourceMap: true
                    }
                }, {
                    loader: "postcss-loader", options: {
                        sourceMap: true
                    }
                },{
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
            }) 
        }, { 
            test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" 
        }]
    }
 });
