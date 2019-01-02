const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ReactRootPlugin = require('html-webpack-root-plugin');
const ReactRootPlugin = require('./react-root');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const projectRoot = path.resolve(__dirname, '..')
const packageJSON = require('../package.json')

const devMode = process.env.NODE_ENV !== 'production';
console.log(`DEV MODE: ${devMode}`);

const indexOptions = {
  title: packageJSON.build.productName,
  'meta': {
    'Content-Security-Policy': { 'http-equiv': 'Content-Security-Policy', 'content': "default-src 'self'; style-src 'self' 'unsafe-inline'" }
  }
}

module.exports = {
  target: 'electron-renderer',
  entry: './app/window/src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'app/window/dist'),
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-source-map',
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: 'styles',
  //         test: /\.css$/,
  //         chunks: 'all',
  //         enforce: true
  //       }
  //     }
  //   }
  // },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: `${projectRoot}/app/window`}),
    new HtmlWebpackPlugin(indexOptions),
    new MiniCssExtractPlugin({
      // filename: devMode ? '[name].css' : 'styles-[name].[hash].css',
      // chunkFilename: devMode ? '[id].css' : '[name].[hash].css'
    }),
    new ReactRootPlugin(),
  ],
  module: {
    rules: [
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
      // {
      //   test: /\.css$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         importLoaders: 1,
      //         sourceMap: true,
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(png|jpg|gif|svg)$/,
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
