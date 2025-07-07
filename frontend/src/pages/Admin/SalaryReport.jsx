import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaFilePdf, FaDownload, FaSearch, FaFilter } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000';

const SalaryReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    startDate: '',
    endDate: ''
  });
  const reportRef = useRef(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      
      const response = await axios.get(
        `${API_BASE_URL}/api/employees/salary/report?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setReportData(response.data.report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate salary report');
    } finally {
      setLoading(false);
    }
  };

  const exportToPdf = () => {
    if (!reportRef.current) return;
    
    const element = reportRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `salary-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
    toast.success('Report exported to PDF');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee Salary Report</h2>
      
      <form onSubmit={generateReport} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              placeholder="Filter by department"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <FaSearch className="mr-1" /> Generate Report
              </>
            )}
          </button>
        </div>
      </form>
      
      {reportData && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Report Results ({reportData.employees.length} employees)
            </h3>
            <button
              onClick={exportToPdf}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <FaFilePdf className="mr-1" /> Export to PDF
            </button>
          </div>
          
          <div ref={reportRef} className="p-4">
            {/* Report header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Employee Salary Report</h2>
              <p className="text-gray-600">
                Generated on: {new Date(reportData.summary.generatedAt).toLocaleDateString()}
              </p>
              {filters.department && <p className="text-sm">Department: {filters.department}</p>}
              {filters.startDate && filters.endDate && (
                <p className="text-sm">
                  Period: {new Date(filters.startDate).toLocaleDateString()} - {new Date(filters.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
          
            {/* Report table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-white uppercase bg-blue-600">
                  <tr>
                    <th className="px-4 py-2">Employee ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2">Basic (Rs)</th>
                    <th className="px-4 py-2">Allowances (Rs)</th>
                    <th className="px-4 py-2">Deductions (Rs)</th>
                    <th className="px-4 py-2">Net Salary (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.employees.map(employee => (
                    <tr key={employee._id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{employee.employeeId}</td>
                      <td className="px-4 py-2">{employee.name}</td>
                      <td className="px-4 py-2">{employee.department}</td>
                      <td className="px-4 py-2">{employee.position}</td>
                      <td className="px-4 py-2">
                        {employee.salary?.basic?.toLocaleString() || '-'}
                      </td>
                      <td className="px-4 py-2">
                        {employee.salary?.allowances?.toLocaleString() || '-'}
                      </td>
                      <td className="px-4 py-2">
                        {employee.salary?.deductions?.toLocaleString() || '-'}
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {employee.salary?.netSalary?.toLocaleString() || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-right">
                      Total:
                    </td>
                    <td className="px-4 py-2">
                      {reportData.summary.totalBasic.toLocaleString()} Rs
                    </td>
                    <td className="px-4 py-2">
                      {reportData.summary.totalAllowances.toLocaleString()} Rs
                    </td>
                    <td className="px-4 py-2">
                      {reportData.summary.totalDeductions.toLocaleString()} Rs
                    </td>
                    <td className="px-4 py-2">
                      {reportData.summary.totalNetSalary.toLocaleString()} Rs
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {/* Summary */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600">Total Employees</div>
                  <div className="text-2xl font-bold">{reportData.summary.totalEmployees}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600">Total Basic Salary</div>
                  <div className="text-2xl font-bold">Rs. {reportData.summary.totalBasic.toLocaleString()}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="text-sm text-yellow-600">Total Allowances</div>
                  <div className="text-2xl font-bold">Rs. {reportData.summary.totalAllowances.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-600">Total Net Salary</div>
                  <div className="text-2xl font-bold">Rs. {reportData.summary.totalNetSalary.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {reportData === null && !loading && (
        <div className="text-center py-8 border rounded-md bg-gray-50">
          <FaFilter className="mx-auto text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500">Select filters and click "Generate Report" to view salary data</p>
        </div>
      )}
    </div>
  );
};

export default SalaryReport;