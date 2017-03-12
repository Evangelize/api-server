const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const Presentations = sequelize.define(
    'presentations',
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
        get() {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set(val) {
          this.setDataValue(
            'entityId',
            (val) ? new Buffer(val, 'hex') : null
          );
        },
      },
      peopleId: {
        type: DataTypes.BLOB,
        get() {
          return moduleUtils.binToHex(this.getDataValue('peopleId'));
        },
        set(val) {
          this.setDataValue('peopleId', new Buffer(val, 'hex'));
        },
      },
      presentation: DataTypes.TEXT,
      title: DataTypes.STRING(255),
      shared: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      globally: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

  return Presentations;
};
