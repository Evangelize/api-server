const moduleUtils = require('../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const MemberJobAssignments = sequelize.define(
    'memberJobAssignments',
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
          this.setDataValue('entityId', new Buffer(val, 'hex'));
        },
      },
      personId: {
        type: DataTypes.BLOB,
        get() {
          return moduleUtils.binToHex(this.getDataValue('personId'));
        },
        set(val) {
          this.setDataValue('personId', new Buffer(val, 'hex'));
        },
      },
      worshipServiceId: {
        type: DataTypes.BLOB,
        get() {
          return moduleUtils.binToHex(this.getDataValue('worshipServiceId'));
        },
        set(val) {
          this.setDataValue('worshipServiceId', new Buffer(val, 'hex'));
        },
      },
      jobId: {
        type: DataTypes.BLOB,
        get() {
          return moduleUtils.binToHex(this.getDataValue('jobId'));
        },
        set(val) {
          this.setDataValue('jobId', new Buffer(val, 'hex'));
        },
      },
      day: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      checkedIn: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      assignmentDate: {
        type: DataTypes.DATE,
        get() {
          const field = 'assignmentDate';
          let ret = null;
          if (this.getDataValue(field)) {
            ret = this.getDataValue(field).getTime();
          }
          return ret;
        },
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

  return MemberJobAssignments;
};
