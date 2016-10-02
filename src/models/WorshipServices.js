module.exports = function (sequelize, DataTypes) {
  const WorshipServices = sequelize.define(
    'worshipServices',
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
      title: {
        type: DataTypes.STRING,
      },
      day: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      time: {
        type: DataTypes.DATE,
        get() {
          const field = 'time';
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

  return WorshipServices;
};
