import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaHistory, FaMoneyBillWave } from 'react-icons/fa';
import SalaryAssignmentForm from './SalaryAssignmentForm';
import SalaryHistory from './SalaryHistory';
import SalaryReport from './SalaryReport';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000';

const EmployeeSalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('employees'); // 'employees', 'assign', 'history', 'report'
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching employees...');
      
      // Log the API URL being called
      const apiUrl = `${API_BASE_URL}/api/employees`;
      console.log('Calling API endpoint:', apiUrl);
      
      // Add specific configurations to the request
      const config = {
        withCredentials: true, // This is important for sending cookies
        headers: { 
          'Content-Type': 'application/json'
        }
      };
      
      console.log('Request config:', config);
      
      const response = await axios.get(apiUrl, config);
      console.log('API Response:', response.data);

      if (response.data.success) {
        setEmployees(response.data.employees);
        console.log('Employees loaded:', response.data.employees.length);
      } else {
        console.error('API returned success:false');
        setError(`Failed to fetch employees: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Network error';
      setError(`Failed to fetch employees: ${errorMessage}`);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSalaryAssigned = () => {
    fetchEmployees();
    setActiveTab('employees');
    toast.success('Salary assigned successfully');
  };

  const renderEmployeesList = () => (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Employee Salary Management</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
          <button 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded" 
            onClick={fetchEmployees}
          >
            Try Again
          </button>
        </div>
      )}
      
      {employees.length === 0 && !loading && !error ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p><strong>No employees found.</strong> There might not be any employees in the database yet.</p>
        </div>
      ) : (
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-white uppercase bg-blue-600">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Current Salary (Rs)</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{employee.employeeId}</td>
                <td className="px-6 py-4">{employee.name}</td>
                <td className="px-6 py-4">{employee.department}</td>
                <td className="px-6 py-4">{employee.position}</td>
                <td className="px-6 py-4">
                  {employee.salary?.netSalary ? 
                    employee.salary.netSalary.toLocaleString('en-US') : 
                    'Not assigned'}
                </td>
                <td className="px-6 py-4">
                  {employee.salary?.lastUpdated ? 
                    new Date(employee.salary.lastUpdated).toLocaleDateString() : 
                    'N/A'}
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setActiveTab('assign');
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                    title="Assign Salary"
                  >
                    <FaMoneyBillWave size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setActiveTab('history');
                    }}
                    className="text-green-600 hover:text-green-900"
                    title="Salary History"
                    disabled={!employee.salary?.history?.length}
                  >
                    <FaHistory size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <div className="flex mb-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'employees' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('employees')}
          >
            Employees List
          </button>
          {selectedEmployee && activeTab === 'assign' && (
            <button
              className={`px-4 py-2 ${activeTab === 'assign' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            >
              Assign/Edit Salary
            </button>
          )}
          {selectedEmployee && activeTab === 'history' && (
            <button
              className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            >
              Salary History
            </button>
          )}
          <button
            className={`px-4 py-2 ${activeTab === 'report' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('report')}
          >
            Generate Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'employees' && renderEmployeesList()}
          
          {activeTab === 'assign' && selectedEmployee && (
            <SalaryAssignmentForm 
              employee={selectedEmployee} 
              onSalaryAssigned={handleSalaryAssigned}
              onCancel={() => setActiveTab('employees')}
            />
          )}
          
          {activeTab === 'history' && selectedEmployee && (
            <SalaryHistory 
              employeeId={selectedEmployee._id}
              onBack={() => setActiveTab('employees')}
            />
          )}
          
          {activeTab === 'report' && (
            <SalaryReport />
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeSalaryManagement;