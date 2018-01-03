const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
const OfflinePlugin = require('offline-plugin');
const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/dist');
const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    vendor: [
      'babel-polyfill',

      //
      // Generate this list using the following command against the stdout of
      // webpack running against the source bundle config (dev/prod.js):
      //
      //    webpack --config webpack/dev.config.js --display-modules | egrep -o 'babel-runtime/\S+' | sed 's/\.js$//' | sort | uniq

      // <babel-runtime>
      'babel-runtime/core-js/array/from',
      'babel-runtime/core-js/array/from.js',
      'babel-runtime/core-js/get-iterator',
      'babel-runtime/core-js/get-iterator.js',
      'babel-runtime/core-js/is-iterable',
      'babel-runtime/core-js/is-iterable.js',
      'babel-runtime/core-js/object/assign',
      'babel-runtime/core-js/object/assign.js',
      'babel-runtime/core-js/object/create',
      'babel-runtime/core-js/object/create.js',
      'babel-runtime/core-js/object/define-properties',
      'babel-runtime/core-js/object/define-properties.js',
      'babel-runtime/core-js/object/define-property',
      'babel-runtime/core-js/object/define-property.js',
      'babel-runtime/core-js/object/entries',
      'babel-runtime/core-js/object/entries.js',
      'babel-runtime/core-js/object/get-prototype-of',
      'babel-runtime/core-js/object/get-prototype-of.js',
      'babel-runtime/core-js/object/keys',
      'babel-runtime/core-js/object/keys.js',
      'babel-runtime/core-js/object/set-prototype-of',
      'babel-runtime/core-js/object/set-prototype-of.js',
      'babel-runtime/core-js/object/values',
      'babel-runtime/core-js/object/values.js',
      'babel-runtime/core-js/symbol',
      'babel-runtime/core-js/symbol/iterator',
      'babel-runtime/core-js/symbol/iterator.js',
      'babel-runtime/core-js/symbol.js',
      'babel-runtime/helpers/classCallCheck',
      'babel-runtime/helpers/classCallCheck.js',
      'babel-runtime/helpers/createClass',
      'babel-runtime/helpers/createClass.js',
      'babel-runtime/helpers/defineProperty',
      'babel-runtime/helpers/defineProperty.js',
      'babel-runtime/helpers/extends',
      'babel-runtime/helpers/extends.js',
      'babel-runtime/helpers/inherits',
      'babel-runtime/helpers/inherits.js',
      'babel-runtime/helpers/objectWithoutProperties',
      'babel-runtime/helpers/objectWithoutProperties.js',
      'babel-runtime/helpers/possibleConstructorReturn',
      'babel-runtime/helpers/possibleConstructorReturn.js',
      'babel-runtime/helpers/slicedToArray',
      'babel-runtime/helpers/slicedToArray.js',
      'babel-runtime/helpers/toArray',
      'babel-runtime/helpers/toArray.js',
      'babel-runtime/helpers/toConsumableArray',
      'babel-runtime/helpers/toConsumableArray.js',
      'babel-runtime/helpers/typeof',
      'babel-runtime/helpers/typeof.js',
      // </babel-runtime>

      'axios',
      'react',
      'material-ui',
      'react-dom',
      'react-hot-loader',
      'mobx-react',
      'react-router',
      'mobx',
    ],
    app: [
      'babel-polyfill',
      './src/index',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
    {
      test: /\.scss$/,
      use: extractSass.extract({
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
        // use style-loader in development
        fallback: 'style-loader',
      }),
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
      ],
    },
    {
      test: /\.less$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'less-loader' },
      ],
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file-loader?hash=sha512&digest=hex&name=assets/[hash].[ext]',
        'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
      ],
    }],
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: 1,
      },
      'typeof window': JSON.stringify('object'),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    extractSass,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        ie8: false,
        compress: true,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/,
      debug: true,
      options: {
        postcss() {
          return [precss, autoprefixer];
        },
        context: path.join(__dirname, 'src'),
        output: { path: path.join(__dirname, 'dist') },
      },
    }),
    new ReactLoadablePlugin({
      filename: path.join(assetsPath, 'loadable-chunks.json'),
    }),
    new OfflinePlugin(),
    webpackIsomorphicToolsPlugin,
  ],
};
