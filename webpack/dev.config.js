const webpack = require('webpack');
const path = require('path');
const featureFlagsPlugin = new webpack.DefinePlugin({
  __DEV__: true,
  __RELEASE__: false,
});

module.exports = {
  target:  'web',
  cache:   false,
  context: __dirname,
  debug: true,
  devtool: '#inline-source-map',
  entry: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
      path.join(__dirname, '../src/index.js'),
    ],
  output:  {
    path:          path.join(__dirname, '../static/dist'),
    filename:      'client.js',
    publicPath:    '/hot',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BROWSER: 1,
      },
      'typeof window': JSON.stringify('object'),
    }),
    featureFlagsPlugin,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module:  {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: [
            /node_modules/,
          ],
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: [
              ['fast-async'],
              ['transform-decorators-legacy'],
              ['react-transform', {
                transforms: [
                  {
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module'],
                  }, {
                    transform: 'react-transform-catch-errors',
                    imports: ['react', 'redbox-react'],
                  },
                ],
              }],
            ],
          },
        },
        {
          test: /\.json?$/,
          loader: 'json-loader',
        },
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?sourceMap&sourceComments',
          ],
        },
        { 
          test: /worker\.js$/,
          loader: 'worker-loader?inline=true',
        },
      ],
  },
  postcss: () => {
    return [
      require('postcss-cssnext')(),
    ]
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
  worker: {
    output: {
      filename: "hash.worker.js",
      chunkFilename: "[id].hash.worker.js"
    }
  },
};
