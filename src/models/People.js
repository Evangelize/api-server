module.exports = function (sequelize, DataTypes) {
  var People = sequelize.define(
    'people',
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
      "familyId": {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          if (this.getDataValue('familyId')) {
            return this.getDataValue('familyId').toString('hex');
          } else {
            return null;
          }
        },
        set: function(val) {
          this.setDataValue('familyId', new Buffer(val, "hex"));
        }
      },
      "cohort": {
        type: DataTypes.BLOB,
        primaryKey: true,
        get: function()  {
          if (this.getDataValue('cohort')) {
            return this.getDataValue('cohort').toString('hex');
          } else {
            return null;
          }
        },
        set: function(val) {
          this.setDataValue('cohort', new Buffer(val, "hex"));
        }
      },
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
        associate: function(models) {
          People.hasOne(models.Teachers, {foreignKey: 'peopleId'});
          People.hasOne(models.Students, {foreignKey: 'peopleId'});
        }
      }
    }
  );

  return People;
};
