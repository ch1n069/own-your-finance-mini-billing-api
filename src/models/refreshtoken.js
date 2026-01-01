"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  RefreshToken.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_agent: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      is_revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      revoked_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      revoked_reason: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "refresh",
      // timestamps: true
    }
  );
  return RefreshToken;
};
