/* eslint-disable no-console */

// Register babel to have ES6 support on the server
require('babel-register')({
    presets: ['es2015', 'stage-0', 'react'],
    plugins: [
      ['transform-decorators-legacy'],
      ['add-module-exports'],
    ],
});

require('./pptx');
