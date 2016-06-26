const webpack = require("webpack");
const path = require("path");

module.exports = {
	target:  "web",
	cache:   false,
	context: __dirname,
    debug: true,
    devtool: 'eval',
	entry:  [
      'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
      path.join(__dirname, '../src/index.js')
    ],
	output:  {
		path:          path.join(__dirname, '../static/dist'),
		filename:      "client.js",
		publicPath:    "/hot"
	},
	plugins: [
		new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false}),
    new webpack.DefinePlugin({__DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))}),
		new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify( 'development' ),
          '__DEV__': JSON.stringify( process.env.NODE_ENV )
        }),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
	],
	module:  {
      loaders: [
        {
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            stage: 0,
            plugins: [ 'react-transform' ],
            extra: {
              'react-transform': {
                transforms: [
                  {
                    transform: 'react-transform-hmr',
                    imports: [ 'react' ],
                    locals: [ 'module' ]
                  }, {
                    transform: 'react-transform-catch-errors',
                    imports: [ 'react', 'redbox-react' ]
                  }
                ]
              }
            }
          }
        }, {
          test: /\.json?$/,
          loader: 'json-loader'
        },
        {
          test: /\.css$/, // Only .css files
          loader: 'style-loader!css-loader' // Run both loaders
        }
      ]
	},
	resolve: {
      alias: {
        react: path.join(__dirname, "../node_modules/react")
      },
      modulesDirectories: [
        "src",
        "node_modules",
        "web_modules"
      ],
      extensions: ["", ".json", ".js", ".jsx"]
	},
	node:    {
      __dirname: true,
      fs:        'empty'
	}
};
