module.exports = function (sequelize, DataTypes) {
  var Notes = sequelize.define(
    'notes',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
      "reminderDate": DataTypes.DATE,
      "createdAt": DataTypes.DATE,
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
