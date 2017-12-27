'use strict';

var fs        = require('fs');
var _         = require('lodash');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../../config');
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password,
    config.mysql,
    {
      'timezone': '+00:00'
    }
  );
}

var Revisions = require('sequelize-revisions')(sequelize, {
  revisionModel: 'revisions',
  revisionChangeModel: 'revisionChanges',
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(__dirname, file));
    model.enableRevisions();
    db[_.upperFirst(model.name)] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

Revisions.defineModels();
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
