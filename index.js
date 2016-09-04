/* eslint-disable no-console */

// Register babel to have ES6 support on the server
require('babel-register')({
    presets: ['es2015', 'stage-0', 'react'],
    plugins: [
      ['transform-decorators-legacy'],
      ['add-module-exports'],
    ],
});

const chalk = require( 'chalk' );

// Prevent issues with libraries using this var (see http://tinyurl.com/pcockwk)
delete process.env.BROWSER;

// Check enviroment for production
const enviroment = process.env.NODE_ENV || 'development';

// Production Server details
const HOST = process.env.IP || 'localhost';
const PORT = process.env.PORT || 3001;


require( './src/server' )( HOST, PORT, ( server ) => {
  console.info( chalk.bold.green( '==> Hapi '+enviroment+' server is listening on', server.info.uri ));
});
