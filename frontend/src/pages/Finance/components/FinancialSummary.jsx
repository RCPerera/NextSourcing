import React from 'react';
import { FaDollarSign, FaUsers, FaShoppingBag, FaPercentage } from 'react-icons/fa';

const FinancialSummary = ({ summary }) => {
  if (!summary) {
    return (
      <div className="text-center text-gray-500 py-10">
        No financial data available for the selected period.
      </div>
    );
  }

  const { orders, salaries, overview } = summary;

  // Format order data with null check
  const formatCurrency = (value) => {
    // Check if value is undefined or null
    if (value === undefined || value === null) {
      return 'Rs 0';
    }
    return `Rs ${value.toLocaleString()}`;
  };

  // Helper function to render a summary card with safe value access
  const renderSummaryCard = (title, value, icon, color) => {
    // Ensure we have a valid value or default to 0
    const displayValue = value || 'Rs 0';
    
    return (
      <div className={`p-4 rounded-lg bg-${color}-50 border border-${color}-200`}>
        <div className="flex justify-between items-center mb-2">
          <div className={`w-8 h-8 rounded-full bg-${color}-100 flex items-center justify-center`}>
            {icon}
          </div>
          <h3 className={`text-${color}-700 text-sm font-medium`}>{title}</h3>
        </div>
        <div className="text-xl font-bold">{displayValue}</div>
      </div>
    );
  };

  return (
    <div>
      {/* Overview Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderSummaryCard(
            'Total Revenue',
            formatCurrency(overview?.totalRevenue || 0),
            <FaDollarSign className="text-blue-500" />,
            'blue'
          )}
          
          {renderSummaryCard(
            'Total Expenses',
            formatCurrency(overview?.totalExpenses || 0),
            <FaDollarSign className="text-red-500" />,
            'red'
          )}
          
          {renderSummaryCard(
            'Profit/Loss',
            formatCurrency(overview?.profitLoss || 0),
            <FaDollarSign className={(overview?.profitLoss || 0) >= 0 ? "text-green-500" : "text-red-500"} />,
            (overview?.profitLoss || 0) >= 0 ? 'green' : 'red'
          )}
          
          {renderSummaryCard(
            'Profit Margin',
            `${overview?.profitMargin || 0}%`,
            <FaPercentage className={parseFloat(overview?.profitMargin || 0) >= 0 ? "text-green-500" : "text-red-500"} />,
            parseFloat(overview?.profitMargin || 0) >= 0 ? 'green' : 'red'
          )}
        </div>
      </div>
      
      {/* Orders Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Total Orders</div>
              <div className="text-xl font-semibold">{orders?.orderCount || 0}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
              <div className="text-xl font-semibold">
                {formatCurrency(orders?.totalPotentialRevenue || orders?.totalRevenue || 0)}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Average Order Value</div>
              <div className="text-xl font-semibold">{formatCurrency(orders?.avgOrderValue || 0)}</div>
            </div>
          </div>
          
          {/* Revenue by payment method */}
          {orders?.revenueByPaymentMethod && Object.keys(orders.revenueByPaymentMethod).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Revenue by Payment Method</h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Payment Method</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                      <th className="px-4 py-2 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(orders.revenueByPaymentMethod).map(([method, revenue], index) => {
                      const totalRev = orders.totalPotentialRevenue || orders.totalRevenue || 1; // Prevent division by zero
                      const percentage = ((revenue / totalRev) * 100).toFixed(2);
                      return (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{method}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(revenue)}</td>
                          <td className="px-4 py-2 text-right">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue by order status (newly added) */}
          {orders?.revenueByStatus && Object.keys(orders.revenueByStatus).length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Revenue by Order Status</h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Order Status</th>
                      <th className="px-4 py-2 text-right">Revenue</th>
                      <th className="px-4 py-2 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(orders.revenueByStatus).map(([status, revenue], index) => {
                      const totalRev = orders.totalPotentialRevenue || orders.totalRevenue || 1; // Prevent division by zero
                      const percentage = ((revenue / totalRev) * 100).toFixed(2);
                      return (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{status}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(revenue)}</td>
                          <td className="px-4 py-2 text-right">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Salaries Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Salary Summary</h3>
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Employee Count</div>
              <div className="text-xl font-semibold">{salaries?.employeeCount || 0}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Total Salary Expense</div>
              <div className="text-xl font-semibold">{formatCurrency(salaries?.totalSalaries || 0)}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-500 mb-1">Average Salary</div>
              <div className="text-xl font-semibold">{formatCurrency(salaries?.avgSalary || 0)}</div>
            </div>
          </div>
          
          {/* Department-wise salary breakdown */}
          {salaries?.departmentSalaries && Object.keys(salaries.departmentSalaries).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Salary by Department</h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Department</th>
                      <th className="px-4 py-2 text-right">Total Salary</th>
                      <th className="px-4 py-2 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(salaries.departmentSalaries).map(([dept, salary], index) => {
                      const totalSalary = salaries.totalSalaries || 1; // Prevent division by zero
                      const percentage = ((salary / totalSalary) * 100).toFixed(2);
                      return (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{dept}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(salary)}</td>
                          <td className="px-4 py-2 text-right">{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;