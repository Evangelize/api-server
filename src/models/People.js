module.exports = function (sequelize, DataTypes) {
  var People = sequelize.define(
    'people',
    {
      "id": { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      "familyName": DataTypes.STRING,
      "lastName": DataTypes.STRING,
      "firstName": DataTypes.STRING,
      "familyPosition": DataTypes.STRING(1),
      "gender": DataTypes.STRING(1),
      "address1": DataTypes.STRING,
      "address2": DataTypes.STRING,
      "city": DataTypes.STRING,
      "state": DataTypes.STRING(2),
      "zipCode": DataTypes.STRING(20),
      "homePhoneNumber": DataTypes.STRING,
      "workPhoneNumber": DataTypes.STRING,
      "cellPhoneNumber": DataTypes.STRING,
      "emailAddress": DataTypes.STRING,
      "birthday": DataTypes.DATE,
      "nonChristian": { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      "nonMember": { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      "membershipStatus": DataTypes.STRING(1),
      "collegeStudent": { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      "individualPhotoUrl": DataTypes.STRING,
      "familyPhotoUrl": DataTypes.STRING,
      "createdAt": DataTypes.DATE,
      "updatedAt": DataTypes.DATE,
      "deletedAt": DataTypes.DATE
    },
    {
      paranoid: true,
      classMethods: {
        associate: function(models) {
          People.hasOne(models.Teachers, {foreignKey: 'peopleId'});
          People.hasOne(models.Students, {foreignKey: 'peopleId'});
        }
      }
    }
  );

  return People;
};
