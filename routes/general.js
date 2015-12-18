let expiresIn = 86400000,
    privacy = 'public';

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
        expiresIn: expiresIn,
        privacy: privacy
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
        expiresIn: expiresIn,
        privacy: privacy
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
        expiresIn: expiresIn,
        privacy: privacy
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
        expiresIn: expiresIn,
        privacy: privacy
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
        expiresIn: expiresIn,
        privacy: privacy
      }
    }
  }
];
