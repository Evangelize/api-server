const path = require('path');
const fs = require('fs');
let settings = {
  mysql: {},
  redis: {},
  stripe: {},
  tokenKey: {},
  firebase: {},
  websocket: {},
  s3: {},
};
try {
  settings = require('./settings');
} catch(e) {
  console.log('no settings.js');
}
// Main server/app configuration
module.exports = {
  mysql: {
    host     : process.env.DB_PORT_3306_TCP_ADDR || process.env.DB_HOST || settings.mysql.host || 'localhost',
    username : process.env.DB_USERNAME || settings.mysql.username || 'wdwtables',
    password : process.env.DB_PASSWORD || settings.mysql.password || 'password',
    database : process.env.DB_DATABASE || settings.mysql.database|| 'wdwtables',
    dialect: 'mysql',
    multipleStatements: true,
  },
  redis: {
    host: process.env.REDIS_PORT_6379_TCP_ADDR || process.env.REDIS_HOST || settings.redis.host || 'localhost',
    port: process.env.REDIS_PORT_6379_TCP_PORT || process.env.REDIS_PORT || settings.redis.port || 6379,
    db: process.env.REDIS_DB || settings.redis.db || 0,
  },
  mail: {
    host: 'localhost',
    port: 25,
  },
  stripe: {
    key: process.env.STRIPE_KEY || settings.stripe.key || 'key',
  },
  tokenKey: {
    private: process.env.TOKEN_KEY_PRIVATE || settings.tokenKey.private || null,
    public: process.env.TOKEN_KEY_PUBLIC || settings.tokenKey.public || null,
  },
  websocket: {
    port: process.env.WEBSOCKET_PORT || settings.websocket.port || null,
    host: process.env.WEBSOCKET_HOST || settings.websocket.host || null,
  },
  firebase: {
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || settings.firebase.serviceAccount || null,
    databaseURL: process.env.FIREBASE_DATABASE_URL || settings.firebase.databaseURL || 'https://xxxx.firebaseio.com',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || settings.firebase.authDomain || 'evangelize-75f29.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || settings.firebase.projectId || 'project Id',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || settings.firebase.storageBucket || 'xxxx.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || settings.firebase.messagingSenderId || 'messaging sender id',
    fbAppId: process.env.FIREBASE_FB_APP_ID || settings.firebase.fbAppId || 'fb app id',
    apiKey: process.env.FIREBASE_API_KEY || settings.firebase.apiKey || 'api key',
  },
  s3: {
    endPoint: process.env.S3_ENDPOINT || settings.s3.endpoint || 'minio-eu1.evangelize.io',
    accessKey: process.env.S3_ACCESS_KEY || settings.s3.accessKey || 'IJZE87BIVO7K9K94TT10',
    secretKey: process.env.S3_SECRET_KEY || settings.s3.secretKey || 'grv4srGHlNBfcZjGNemNvowDvvi3UYl/18TV34Ff',
    secure: process.env.S3_SECURE || settings.s3.secure || true
  },
  host: process.env.WEB_HOST || settings.host || 'localhost',
  port: process.env.WEB_PORT || settings.port || 3000,
  key: process.env.SALT_KEY || settings.key || 'key',
  serviceName: 'Evangelize',
  serviceUrl: process.env.SERVICE_URL || settings.serviceUrl || 'https://localhost',
};
