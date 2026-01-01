'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    static associate(models) {
      Bill.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Bill.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255]
      }
    },
    amount: {
      type: DataTypes.DECIMAL(19, 5),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01
      }
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'paid', 'overdue', 'cancelled']]
      }
    }
  }, {
    sequelize,
    modelName: 'Bill',
    tableName: 'Bills',
    timestamps: true
  });
  return Bill;
};