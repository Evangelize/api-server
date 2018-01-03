const path = require('path');
const webpack = require('webpack');
const projectRootPath = path.resolve(__dirname, '../');

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',

  output: {
    path: path.join(projectRootPath, 'static/dist/dlls'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]_[hash]'
  },

  performance: {
    hints: false
  },

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
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    new webpack.DllPlugin({
      path: path.join(projectRootPath, 'webpack/dlls/[name].json'),
      name: 'DLL_[name]_[hash]'
    })
  ]
};
