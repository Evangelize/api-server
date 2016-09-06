module.exports = function (sequelize, DataTypes) {
  const YearMeetingDays = sequelize.define(
    'yearMeetingDays',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get() {
          return this.getDataValue('id').toString('hex');
        },
        set(val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        },
      },
      yearId: {
        type: DataTypes.BLOB,
        get() {
          return this.getDataValue('yearId').toString('hex');
        },
        set(val) {
          this.setDataValue('yearId', new Buffer(val, 'hex'));
        },
      },
      dow: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
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
      paranoid: true,
    }
  );

  return YearMeetingDays;
};