const express = require('express');
const EmployeeController = require('../controllers/EmployeeController');
const router = express.Router();

// GET request
router.get('/employees', EmployeeController.getAll);

// GET request for a single employee
router.get('/employees/:sap_id', EmployeeController.getById);

// POST request
router.post('/employees', EmployeeController.create);

// PUT request
router.put('/employees/:sap_id', EmployeeController.update);

// DELETE request
router.delete('/employees/:sap_id', EmployeeController.delete);

module.exports = router;
