module.exports = function (sequelize, DataTypes) {
  var Notes = sequelize.define(
    'notes',
    {
      "id": {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          return this.getDataValue('id').toString('hex');
        },
        set: function(val) {
          this.setDataValue('id', new Buffer(val, "hex"));
        }
      },
      "type": {
        type: DataTypes.ENUM(
          'none',
          'user',
          'class'
        ),
        defaultValue: 'none'
      },
      "typeId": DataTypes.INTEGER,
      "text": DataTypes.TEXT,
      "title": DataTypes.TEXT,
      "reminderDate": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('reminderDate')) {
            return this.getDataValue('reminderDate').getTime();
          } else {
            return null;
          }
        }
      },
      "createdAt": {
        type: DataTypes.DATE,
        get: function()  {
          if (this.getDataValue('createdAt')) {
            return this.getDataValue('createdAt').getTime();
          } else {
            return null;
          }
        }
      },
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE,
      "revision": {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      paranoid: true
    }
  );

  return Notes;
};
