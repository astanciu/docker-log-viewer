const webpack = require('webpack')
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRootPlugin = require('./react-root');
const devMode = process.env.NODE_ENV !== 'production';
const packageJSON = require('../package.json')
console.log(`DEV MODE: ${devMode}`);

const indexOptions = {
  title: packageJSON.build.productName,
  'meta': {
    'Content-Security-Policy': { 
      'http-equiv': 'Content-Security-Policy', 
      'content': "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com file: data:" }
  }
}

module.exports = {
  watch: true,
  target: 'electron-renderer',
  entry: './app/window/src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'app/window/dist'),
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin(indexOptions),
    new ReactRootPlugin(),
    new webpack.DefinePlugin({
      '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[a|c]ss$/,
        exclude: /node_modules/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};
