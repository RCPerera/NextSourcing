import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000';

const SalaryHistory = ({ employeeId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [currentSalary, setCurrentSalary] = useState(null);

  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/employees/${employeeId}/salary`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setSalaryHistory(response.data.salaryHistory || []);
          setCurrentSalary(response.data.currentSalary);
          
          // Get employee details
          const empResponse = await axios.get(`${API_BASE_URL}/api/employees`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (empResponse.data.success) {
            const emp = empResponse.data.employees.find(e => e._id === employeeId);
            if (emp) {
              setEmployee(emp);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching salary history:', error);
        toast.error('Failed to fetch salary history');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchSalaryHistory();
    }
  }, [employeeId]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2">Loading salary history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Salary History</h2>
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-1" /> Back to List
        </button>
      </div>

      {employee && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-lg">{employee.name}</h3>
          <p className="text-sm text-gray-600">
            Employee ID: {employee.employeeId} | Department: {employee.department} | Position: {employee.position}
          </p>
          
          {currentSalary && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <h4 className="text-md font-medium">Current Salary Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Basic Salary</p>
                  <p className="font-medium">Rs. {currentSalary.basic.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Allowances</p>
                  <p className="font-medium">Rs. {currentSalary.allowances.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Deductions</p>
                  <p className="font-medium">Rs. {currentSalary.deductions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Net Salary</p>
                  <p className="font-medium">Rs. {currentSalary.netSalary.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Last Updated: {currentSalary.lastUpdated ? new Date(currentSalary.lastUpdated).toLocaleString() : 'N/A'}
              </p>
            </div>
          )}
        </div>
      )}

      {salaryHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-white uppercase bg-blue-600">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Basic (Rs)</th>
                <th className="px-6 py-3">Allowances (Rs)</th>
                <th className="px-6 py-3">Deductions (Rs)</th>
                <th className="px-6 py-3">Net Salary (Rs)</th>
                <th className="px-6 py-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {salaryHistory.map((record, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{record.basic.toLocaleString()}</td>
                  <td className="px-6 py-4">{record.allowances.toLocaleString()}</td>
                  <td className="px-6 py-4">{record.deductions.toLocaleString()}</td>
                  <td className="px-6 py-4">{record.netSalary.toLocaleString()}</td>
                  <td className="px-6 py-4">{record.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500">No salary history records found.</p>
        </div>
      )}
    </div>
  );
};

export default SalaryHistory;