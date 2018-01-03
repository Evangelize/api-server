const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const projectRootPath = path.resolve(__dirname, '../');
const buildPath = path.resolve(projectRootPath, './build');

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: [
    'babel-polyfill',
    './src/server.js',
  ],
  output: {
    path: buildPath,
    filename: 'build.js',
  },
  target: 'node',
  externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore', 'hiredis'],
  plugins: [
    new webpack.ContextReplacementPlugin(
      /Sequelize(\\|\/)/,
      path.resolve(__dirname, '../src')
    ),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            'fast-async',
            'transform-decorators-legacy',
            'transform-class-properties',
            'add-module-exports',
          ],
          presets: [
            'stage-0',
            'es2015',
          ],
        },
      }, 
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};