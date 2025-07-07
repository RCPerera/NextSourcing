import React from 'react';
import { FaFilter } from 'react-icons/fa';

const FinancialFilter = ({ dateRange, onFilterChange }) => {
  const handleStartDateChange = (e) => {
    onFilterChange({
      ...dateRange,
      startDate: e.target.value
    });
  };

  const handleEndDateChange = (e) => {
    onFilterChange({
      ...dateRange,
      endDate: e.target.value
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <FaFilter className="text-gray-500 mr-2" />
        <span className="text-sm font-medium mr-2">Filter by:</span>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={handleStartDateChange}
          className="border rounded-md px-2 py-1 text-sm"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={handleEndDateChange}
          className="border rounded-md px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};

export default FinancialFilter;