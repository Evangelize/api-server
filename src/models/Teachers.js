module.exports = function (sequelize, DataTypes) {
  var Teachers = sequelize.define(
    'teachers',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "peopleId": DataTypes.INTEGER,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      paranoid: true
    }
  );

  return Teachers;
};
