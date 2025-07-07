import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000';

const SalaryAssignmentForm = ({ employee, onSalaryAssigned, onCancel }) => {
  const [formData, setFormData] = useState({
    basic: 0,
    allowances: 0,
    deductions: 0,
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [netSalary, setNetSalary] = useState(0);

  useEffect(() => {
    // If employee already has salary data, populate form
    if (employee?.salary) {
      setFormData({
        basic: employee.salary.basic || 0,
        allowances: employee.salary.allowances || 0,
        deductions: employee.salary.deductions || 0,
        note: `Salary update for ${employee.name}`
      });
    }
  }, [employee]);

  // Calculate net salary whenever form inputs change
  useEffect(() => {
    const net = (Number(formData.basic) + Number(formData.allowances)) - Number(formData.deductions);
    setNetSalary(net > 0 ? net : 0);
  }, [formData.basic, formData.allowances, formData.deductions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'note' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Validate inputs
      if (formData.basic < 0 || formData.allowances < 0 || formData.deductions < 0) {
        toast.error('Salary values cannot be negative');
        return;
      }

      if (netSalary <= 0) {
        toast.error('Net salary must be greater than zero');
        return;
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/employees/${employee._id}/salary`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        onSalaryAssigned();
      }
    } catch (error) {
      console.error('Error assigning salary:', error);
      toast.error(error.response?.data?.message || 'Failed to assign salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {employee.salary?.netSalary > 0 ? 'Update' : 'Assign'} Salary for {employee.name}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Employee ID: {employee.employeeId} | Department: {employee.department} | Position: {employee.position}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Basic Salary (Rs)
            </label>
            <input
              type="number"
              name="basic"
              value={formData.basic}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Allowances (Rs)
            </label>
            <input
              type="number"
              name="allowances"
              value={formData.allowances}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Deductions (Rs)
            </label>
            <input
              type="number"
              name="deductions"
              value={formData.deductions}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Net Salary (Rs)
            </label>
            <input
              type="number"
              value={netSalary}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight bg-gray-100"
              readOnly
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Note
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="2"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Save Salary'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalaryAssignmentForm;