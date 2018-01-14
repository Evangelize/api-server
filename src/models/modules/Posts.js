const moduleUtils = require('../../lib/moduleUtils');
module.exports = function (sequelize, DataTypes) {
  const Posts = sequelize.define(
    'posts',
    {
      id: {
        type: DataTypes.BLOB,
        primaryKey: true,
        get() {
          return moduleUtils.binToHex(this.getDataValue('id'));
        },
        set(val) {
          this.setDataValue('id', new Buffer(val, 'hex'));
        },
      },
      entityId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('entityId'));
        },
        set: function (val) {
          if (val) {
            this.setDataValue('entityId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('entityId', null);
          }
        },
      },
      authorId: {
        type: DataTypes.BLOB,
        get: function () {
          return moduleUtils.binToHex(this.getDataValue('authorId'));
        },
        set: function (val) {
          if (val) {
            this.setDataValue('authorId', new Buffer(val, 'hex'));
          } else {
            this.setDataValue('authorId', null);
          }
        },
      },
      state: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft',
      },
      title: {
        type: DataTypes.STRING(255),
      },
      description: {
        type: DataTypes.TEXT,
      },
      body: {
        type: DataTypes.TEXT,
      },
      featuredImage: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          const field = 'createdAt';
          let ret = null;
          if (this.getDataValue(field)) {
            ret = this.getDataValue(field).getTime();
          }
          return ret;
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          const field = 'updatedAt';
          let ret = null;
          if (this.getDataValue(field)) {
            ret = this.getDataValue(field).getTime();
          }
          return ret;
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
        get() {
          const field = 'deletedAt';
          let ret = null;
          if (this.getDataValue(field)) {
            ret = this.getDataValue(field).getTime();
          }
          return ret;
        },
      },
      revision: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );

  return Posts;
};
