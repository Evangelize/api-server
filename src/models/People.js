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
      "birthday": {
        type: DataTypes.DATE,
        get: function()  {

          if (this.getDataValue('birthday') && this.getDataValue('birthday') !== "0000-00-00 00:00:00") {
            return this.getDataValue('birthday').getTime();
          } else {
            return null;
          }
        }
      },
      "nonChristian": { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      "nonMember": { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      "membershipStatus": DataTypes.STRING(1),
      "collegeStudent": { type: DataTypes.ENUM('y', 'n'), defaultValue: 'n' },
      "individualPhotoUrl": DataTypes.STRING,
      "familyPhotoUrl": DataTypes.STRING,
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
