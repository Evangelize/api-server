/* eslint-disable no-console */

// Register babel to have ES6 support on the server
require('babel-polyfill');
require('babel-register');

require('./src/server');
