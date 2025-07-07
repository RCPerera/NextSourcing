import express from 'express';
import { 
    getEmployees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    assignSalary,
    getSalaryHistory,
    generateSalaryReport
} from '../../controllers/user/employeeController.js';
import { employeeValidation } from '../../middleware/employeeValidation.js';
import { protect, isAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Get all employees - first authenticate user, then check if admin
router.get('/', protect, isAdmin, getEmployees);

// Add new employee
router.post('/', protect, isAdmin, employeeValidation, addEmployee);

// Update employee
router.put('/:id', protect, isAdmin, employeeValidation, updateEmployee);

// Delete employee
router.delete('/:id', protect, isAdmin, deleteEmployee);

// Assign or update salary
router.post('/:id/salary', protect, isAdmin, assignSalary);

// Get salary history for employee
router.get('/:id/salary', protect, isAdmin, getSalaryHistory);

// Generate salary report
router.get('/salary/report', protect, isAdmin, generateSalaryReport);

export default router;