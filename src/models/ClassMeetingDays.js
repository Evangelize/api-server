module.exports = function (sequelize, DataTypes) {
  var ClassMeetingDays = sequelize.define(
    'classMeetingDays',
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
      "divisionConfigId": {
        type: DataTypes.BLOB,
        get: function()  {
          return this.getDataValue('divisionConfigId').toString('hex');
        },
        set: function(val) {
          this.setDataValue('divisionConfigId', new Buffer(val, "hex"));
        }
      },
      "day": DataTypes.INTEGER,
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

  return ClassMeetingDays;
};
