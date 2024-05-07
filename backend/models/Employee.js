const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('shiftbiddb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

class Employee extends Model {}

Employee.init({
  sap_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  emp_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productivity_score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  team_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Employee',
  tableName: 'employee',
  timestamps: false
});

module.exports = Employee;
