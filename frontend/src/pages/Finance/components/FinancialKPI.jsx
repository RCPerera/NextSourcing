import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const FinancialKPI = ({ title, value, growth, subValue, icon }) => {
  // Determine if growth is positive, negative, or not provided
  const renderGrowth = () => {
    if (growth === undefined) return null;
    
    const isPositive = parseFloat(growth) >= 0;
    return (
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
        <span>{Math.abs(growth)}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
        </div>
        {renderGrowth()}
      </div>
    </div>
  );
};

export default FinancialKPI;