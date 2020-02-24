const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
var os = require( 'os' );

// var networkInterfaces = os.networkInterfaces();
// console.log(networkInterfaces);

module.exports = merge(common, {
   devtool: 'inline-source-map',
   devServer: {
        contentBase: './dist',
        watchContentBase: true,
        // host: '192.168.1.183',
        // port: 8080,
        watchOptions: {
            ignored: ["./dist/css/build", "./dist/js", "./dist/packages"]
        },
        hot: true
   },
   plugins: [
       new webpack.NamedModulesPlugin(),
       new webpack.HotModuleReplacementPlugin()
   ],
    module: {
        rules: [{
            test: /\.(scss|sass)$/,
            use: [{
                loader: "style-loader"
            }, {
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
        }, { 
            test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" 
        }]
    }
 });
