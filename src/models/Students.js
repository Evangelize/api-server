module.exports = function (sequelize, DataTypes) {
  var Students = sequelize.define(
    'students',
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

  return Students;
};
