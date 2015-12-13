module.exports = [
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: __dirname+'/../static'
      }
    }
  },
  {
    method: 'GET',
    path: '/img/{param*}',
    handler: {
      directory: {
        path: __dirname+'/../static/images'
      }
    }
  },
  {
    method: 'GET',
    path: '/material/css/{param*}',
    handler: {
      directory: {
        path:  __dirname+'/../node_modules/material-design-lite'
      }
    }
  },
  {
    method: 'GET',
    path: '/chartist/css/{param*}',
    handler: {
      directory: {
        path:  __dirname+'/../node_modules/react-chartist/node_modules/chartist/dist/'
      }
    }
  },
  {
    method: 'GET',
    path: '/css/{param*}',
    handler: {
      directory: {
        path:  __dirname+'/../src/css/'
      }
    }
  }
];
