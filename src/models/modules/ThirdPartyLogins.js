const moduleUtils = require('../../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const ThirdPartyLogins = sequelize.define(
    'thirdPartyLogins',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get() {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set(val) {
          this.setDataValue('id', new Buffer(val, "hex"));
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
      peopleId: {
        type: DataTypes.BLOB,
        get() {
          return moduleUtils.binToHex(this.getDataValue('peopleId'));
        },
        set(val) {
          if (val) {
            this.setDataValue('peopleId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('peopleId', null);
          }
        }
      },
      type: DataTypes.STRING,
      externalId: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        get() {
          let retVal;
          const time = this.getDataValue('createdAt');
          if (time) {
            retVal = (typeof time.getMonth === 'function') ? time.getTime() : time;
          } else {
            retVal = null;
          }

          return retVal;
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          let retVal;
          const time = this.getDataValue('updatedAt');
          if (time) {
            retVal = (typeof time.getMonth === 'function') ? time.getTime() : time;
          } else {
            retVal = null;
          }

          return retVal;
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        get() {
          let retVal;
          const time = this.getDataValue('deletedAt');
          if (time) {
            retVal = (typeof time.getMonth === 'function') ? time.getTime() : time;
          } else {
            retVal = null;
          }

          return retVal;
        },
      },
      revision: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
      classMethods: {
        associate(models) {

        }
      }
    }
  );

  return ThirdPartyLogins;
};
