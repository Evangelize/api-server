const moduleUtils = require('../../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const MemberSettings = sequelize.define(
    'memberSettings',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get() {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set(val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        },
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
      personId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('personId'));
        },
        set: function (val) {
          if (val) {
            this.setDataValue('personId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('personId', null);
          }
        },
      },
      platform: {
        type: DataTypes.ENUM('web', 'android', 'ios'),
        defaultValue: 'web',
      },
      platformId: {
        type: DataTypes.STRING(255),
      },
      settings: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          const field = 'createdAt';
          let ret = null;
          if (this.getDataValue(field)) {
            ret = this.getDataValue(field).getTime();
          }
          return ret;
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          const field = 'updatedAt';
          let ret = null;
          if (this.getDataValue(field)) {
            ret = this.getDataValue(field).getTime();
          }
          return ret;
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        get() {
          const field = 'deletedAt';
          let ret = null;
          if (this.getDataValue(field)) {
            ret = this.getDataValue(field).getTime();
          }
          return ret;
        },
      },
      revision: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );

  return MemberSettings;
};
