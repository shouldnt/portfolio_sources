const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProvidePlugin = require('webpack').ProvidePlugin;

const config = {
  entry: {
    index: ['babel-polyfill','./src/js/index.js', './src/css/index.sass'],
    start: ['./src/js/start.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/css/build/*.css']),
    new ProvidePlugin({
        jQuery: "jquery",
        Tween: 'gsap',
        Ss: 'smooth-scrollbar',
        $: 'jquery',
        lerp: function(v0, v1, t) {
          return v0*(1-t)+v1*t;
        }
    })
  ]
};

module.exports = config;
