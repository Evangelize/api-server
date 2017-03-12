const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const Families = sequelize.define(
    'families',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, "hex"));
        }
      },
      entityId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set: function (val) {
          this.setDataValue('entityId', new Buffer(val, 'hex'));
        },
      },
      name: DataTypes.STRING(255),
      familyName: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING(2),
      zipCode: DataTypes.STRING(20),
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

  return Families;
};
