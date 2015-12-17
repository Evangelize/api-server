module.exports = [
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: __dirname+'/../static'
      }
    },
    config: {
      cache: {
        privacy: 'public'
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
    },
    config: {
      cache: {
        privacy: 'public'
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
    },
    config: {
      cache: {
        privacy: 'public'
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
    },
    config: {
      cache: {
        privacy: 'public'
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
    },
    config: {
      cache: {
        privacy: 'public'
      }
    }
  }
];
