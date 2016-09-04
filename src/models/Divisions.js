module.exports = function (sequelize, DataTypes) {
  const Divisions = sequelize.define(
    'divisions',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return this.getDataValue('id').toString('hex');
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        },
      },
      divisionConfigId:  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('divisionConfigId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('divisionConfigId', new Buffer(val, 'hex'));
        },
      },
      divisionYear:  {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('divisionYear').toString('hex');
        },
        set: function(val) {
          this.setDataValue('divisionYear', new Buffer(val, 'hex'));
        },
      },
      position: DataTypes.INTEGER,
      title: DataTypes.STRING,
      start: {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('start')) {
            return this.getDataValue('start').getTime();
          } else {
            return null;
          }
        },
      },
      end: {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('end')) {
            return this.getDataValue('end').getTime();
          } else {
            return null;
          }
        },
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
      classMethods: {
        associate: (models) => {
          Divisions.hasMany(models.DivisionClasses, { foreignKey: 'divisionId' });
        },
      },
    }
  );

  return Divisions;
};
