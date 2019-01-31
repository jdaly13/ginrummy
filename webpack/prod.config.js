const path = require("path");
const extractPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractSass = new extractPlugin({filename: "[name].bundle.css"})

module.exports = merge(baseConfig, {
  entry: {
    main: './src/js/scripts.js',
  },
  stats: {
    warnings: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        include: [
          path.resolve(process.cwd(), 'src', 'scss')
        ],
        use: extractSass.extract({
            use: [{
                loader: "css-loader", options: {minimize: true}
            }, {
                loader: "sass-loader"
            }],
            fallback: "style-loader"
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "[path][name].[ext]"
            }
          }, 
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: true,
                optimizationLevel: 6
              },
              pngquant: {
                quality: '30-90',
                speed: 6,
                enabled: false
              }
            }
          }
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
  mode: "production",
  output: {
    path: path.resolve(process.cwd(), 'live'),
    filename: '[name].bundle.js'
  },

  plugins: [
    // Extract imported CSS into own file
    extractSass,
    // Minify JS
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      title: "",
      hash: true
    })
  ],
});
