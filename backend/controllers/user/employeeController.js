import Employee from '../../models/user/employeeModel.js';
import { validationResult } from 'express-validator';

// Get all employees
export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

// Add new employee
export const addEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { employeeId, name, email, date, attendTime, leaveTime, department, position } = req.body;

        // Check if employee with same ID exists
        const existingEmployee = await Employee.findOne({ employeeId });
        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this ID already exists'
            });
        }

        const newEmployee = await Employee.create({
            employeeId,
            name,
            email,
            date,
            attendTime,
            leaveTime,
            department,
            position,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            employee: newEmployee
        });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding employee: ' + error.message
        });
    }
};

// Update employee
export const updateEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const { employeeId, name, email, date, attendTime, leaveTime, department, position } = req.body;

        // Check if employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if employeeId is being changed and if new employeeId already exists
        if (employeeId !== employee.employeeId) {
            const existingEmployee = await Employee.findOne({ employeeId });
            if (existingEmployee) {
                return res.status(400).json({
                    success: false,
                    message: 'Employee with this ID already exists'
                });
            }
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                employeeId,
                name,
                email,
                date,
                attendTime,
                leaveTime,
                department,
                position,
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            employee: updatedEmployee
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating employee: ' + error.message
        });
    }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await Employee.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
};

// Deactivate employee
export const deactivateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                status: 'inactive',
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Employee deactivated successfully',
            employee: updatedEmployee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deactivating employee',
            error: error.message
        });
    }
};

// Assign or update salary for an employee
export const assignSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { basic, allowances, deductions, note } = req.body;

        // Check if employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Calculate net salary
        const netSalary = (basic || 0) + (allowances || 0) - (deductions || 0);

        // Create new salary record
        const newSalaryEntry = {
            basic: basic || 0,
            allowances: allowances || 0,
            deductions: deductions || 0,
            netSalary,
            date: new Date(),
            note
        };

        // Update the employee's salary
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            {
                $set: {
                    'salary.basic': basic || 0,
                    'salary.allowances': allowances || 0,
                    'salary.deductions': deductions || 0,
                    'salary.netSalary': netSalary,
                    'salary.lastUpdated': new Date()
                },
                $push: { 'salary.history': newSalaryEntry },
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Salary assigned successfully',
            employee: updatedEmployee
        });
    } catch (error) {
        console.error('Error assigning salary:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning salary: ' + error.message
        });
    }
};

// Get salary history for an employee
export const getSalaryHistory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            salaryHistory: employee.salary?.history || [],
            currentSalary: {
                basic: employee.salary?.basic || 0,
                allowances: employee.salary?.allowances || 0,
                deductions: employee.salary?.deductions || 0,
                netSalary: employee.salary?.netSalary || 0,
                lastUpdated: employee.salary?.lastUpdated
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching salary history',
            error: error.message
        });
    }
};

// Generate salary report
export const generateSalaryReport = async (req, res) => {
    try {
        const { department, startDate, endDate } = req.query;
        
        // Build filter
        const filter = {};
        if (department) filter.department = department;
        if (startDate || endDate) {
            filter['salary.lastUpdated'] = {};
            if (startDate) filter['salary.lastUpdated'].$gte = new Date(startDate);
            if (endDate) filter['salary.lastUpdated'].$lte = new Date(endDate);
        }

        // Find employees with salary data
        const employees = await Employee.find({
            ...filter,
            'salary.netSalary': { $gt: 0 }
        }).select('employeeId name email department position salary');

        // Calculate totals
        const totalBasic = employees.reduce((sum, emp) => sum + (emp.salary?.basic || 0), 0);
        const totalAllowances = employees.reduce((sum, emp) => sum + (emp.salary?.allowances || 0), 0);
        const totalDeductions = employees.reduce((sum, emp) => sum + (emp.salary?.deductions || 0), 0);
        const totalNetSalary = employees.reduce((sum, emp) => sum + (emp.salary?.netSalary || 0), 0);

        res.status(200).json({
            success: true,
            report: {
                employees,
                summary: {
                    totalEmployees: employees.length,
                    totalBasic,
                    totalAllowances,
                    totalDeductions,
                    totalNetSalary,
                    generatedAt: new Date()
                }
            }
        });
    } catch (error) {
        console.error('Error generating salary report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating salary report',
            error: error.message
        });
    }
};