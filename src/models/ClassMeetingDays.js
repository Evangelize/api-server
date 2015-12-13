module.exports = function (sequelize, DataTypes) {
  var ClassMeetingDays = sequelize.define(
    'classMeetingDays',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "divisionConfigId": DataTypes.INTEGER,
      "day": DataTypes.INTEGER,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      paranoid: true
    }
  );

  return ClassMeetingDays;
};
