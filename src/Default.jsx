// Default layout template
import React from 'react';
var Default = React.createClass({

  render: function() {

    return(
      <html>
        <head>
          <title>Redux todos with undo example</title>
          <link rel="stylesheet" href="/node_modules/material-design-lite/material.min.css">
        </head>
        <body>
          <div id="root">
          </div>
          <script src="assets/client.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Default;
