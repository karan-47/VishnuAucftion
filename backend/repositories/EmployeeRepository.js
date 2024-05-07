// EmployeeRepository.js

const Employee = require('../models/Employee');

class EmployeeRepository {
  async create(employee) {
    return await Employee.create(employee);
  }

  async getAll() {
    return await Employee.findAll();
  }

  async getById(sap_id) {
    return await Employee.findOne({ where: { sap_id } });
  }

  async update(sap_id, employee) {
    return await Employee.update(employee, { where: { sap_id } });
  }

  async delete(sap_id) {
    return await Employee.destroy({ where: { sap_id } });
  }
}

module.exports = new EmployeeRepository();
