const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const constants = require('../constants');

module.exports = {
  plugins: [ 
    new CleanWebpackPlugin([path.resolve(process.cwd(), "./live")], { allowExternal: true })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  }
};
