// EmployeeController.js

const EmployeeRepository = require('../repositories/EmployeeRepository');

class EmployeeController {
  async create(req, res) {
    const employee = await EmployeeRepository.create(req.body);
    res.status(201).json(employee);
  }

  async getAll(req, res) {
    const employees = await EmployeeRepository.getAll();
    res.json(employees);
  }

  async getById(req, res) {
    const employee = await EmployeeRepository.getById(req.params.sap_id);
    res.json(employee);
  }

  async update(req, res) {
    await EmployeeRepository.update(req.params.sap_id, req.body);
    res.status(204).end();
  }

  async delete(req, res) {
    await EmployeeRepository.delete(req.params.sap_id);
    res.status(204).end();
  }
}

module.exports = new EmployeeController();
