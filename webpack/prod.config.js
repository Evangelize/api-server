const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const path = require('path');

const featureFlagsPlugin = new webpack.DefinePlugin({
  __DEV__: false,
  __RELEASE__: true,
});


module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '../static/dist'),
    filename: 'client.min.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('bundle.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: 1,
      },
    }),
    featureFlagsPlugin,
    new webpack.optimize.DedupePlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: [
          /node_modules/,
        ],
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: [
            'transform-regenerator',
            'transform-decorators-legacy',
          ],
        },
      },
      {
        test: /\.json?$/,
        loader: 'json-loader',
      },
      { 
        test: /worker\.js$/,
        loader: 'worker-loader?inline=true',
      },
    ],
  },
  resolve: {
    alias: {
      react: path.join(__dirname, '../node_modules/react'),
    },
    modulesDirectories: [
      'src',
      'node_modules',
      'web_modules',
    ],
    extensions: ['', '.json', '.js', '.jsx'],
  },
  node: {
    __dirname: true,
    fs: 'empty',
  },
};
