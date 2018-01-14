const moduleUtils = require('../../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const Groups = sequelize.define(
    'groups',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        }
      },
      entityId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set: function (val) {
          if (val) {
            this.setDataValue('entityId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('entityId', null);
          }
        },
      },
      title: DataTypes.STRING(255),
      createdAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('createdAt')) {
            return this.getDataValue('createdAt').getTime();
          } else {
            return null;
          }
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('updatedAt')) {
            return this.getDataValue('updatedAt').getTime();
          } else {
            return null;
          }
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        get() {
          if (this.getDataValue('deletedAt')) {
            return this.getDataValue('deletedAt').getTime();
          } else {
            return null;
          }
        },
      },
      revision: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true
    }
  );

  return Groups;
};
