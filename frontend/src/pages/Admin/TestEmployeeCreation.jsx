import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000';

const TestEmployeeCreation = () => {
  const [formData, setFormData] = useState({
    employeeId: 'EMP001',
    name: 'Test Employee',
    email: 'test@example.com',
    department: 'IT',
    position: 'Developer',
    date: new Date().toISOString().split('T')[0],
    attendTime: '09:00',
    leaveTime: '17:00'
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No auth token found. Please log in as admin.');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/employees`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API response:', response.data);
      
      if (response.data.success) {
        setResult({
          success: true,
          message: 'Employee created successfully',
          data: response.data.employee
        });
        toast.success('Employee created successfully!');
      } else {
        setResult({
          success: false,
          message: response.data.message || 'Unknown error'
        });
        toast.error(response.data.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      const errorMsg = error.response?.data?.message || error.message;
      setResult({
        success: false,
        message: errorMsg
      });
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Employee Creation</h1>
      <p className="text-gray-600 mb-4">
        Use this form to quickly create a test employee record for development and testing.
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Join Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Attend Time</label>
            <input
              type="time"
              name="attendTime"
              value={formData.attendTime}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Leave Time</label>
            <input
              type="time"
              name="leaveTime"
              value={formData.leaveTime}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Creating...' : 'Create Test Employee'}
          </button>
        </div>
      </form>

      {result && (
        <div className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <h2 className="font-bold text-lg">{result.success ? 'Success!' : 'Error'}</h2>
          <p className="mb-2">{result.message}</p>
          {result.success && result.data && (
            <div className="mt-2">
              <h3 className="font-semibold">Created Employee:</h3>
              <pre className="bg-gray-800 text-green-400 p-2 rounded mt-2 overflow-auto text-sm">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestEmployeeCreation;