const path = require("path");
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(baseConfig, {
  entry: ['./src/js/scripts.js'],
  plugins: [
     new webpack.HotModuleReplacementPlugin(),
     new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
  ],
  watchOptions: {
    poll: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port:9000,
    hot:true
  },
  module: {
      rules: [
        {
          test: /\.(s*)css$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader" // compiles Sass to CSS
          }]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          loader: 'file-loader',
          options: {
            name: "[path][name].[ext]",
          }
        }
    ]
  },
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  }
});
