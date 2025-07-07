import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaMoneyBillWave, FaUserTie, FaShoppingCart, FaFilePdf } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import { AppContent } from '../../context/AppContext';
import FinancialSummary from './components/FinancialSummary';
import RevenueExpenseChart from './components/RevenueExpenseChart';
import FinancialKPI from './components/FinancialKPI';
import FinancialFilter from './components/FinancialFilter';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000';

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const { isLoggedin, userRole } = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const pdfRef = useRef();

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isLoggedin) {
      toast.error('Please log in to access the finance dashboard');
      navigate('/login');
      return;
    }
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }
  }, [isLoggedin, userRole, navigate]);

  // Handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      if (error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else if (error.response.status === 403) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/dashboard');
      } else {
        toast.error(error.response.data.message || 'An error occurred');
      }
    } else {
      toast.error('Network error. Please try again.');
    }
  };

  // Fetch financial KPIs for the dashboard overview
  const fetchFinancialKPIs = async () => {
    try {
      if (!isLoggedin || userRole !== 'admin') return;

      const response = await axios.get(`${API_BASE_URL}/api/finance/kpis`);

      if (response.data.success) {
        setKpis(response.data.kpis);
      } else {
        toast.error('Failed to fetch financial KPIs');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Fetch monthly financial data for charts
  const fetchMonthlyData = async () => {
    try {
      if (!isLoggedin || userRole !== 'admin') return;

      const response = await axios.get(`${API_BASE_URL}/api/finance/monthly`);

      if (response.data.success) {
        setMonthlyData(response.data.monthlyData);
      } else {
        toast.error('Failed to fetch monthly financial data');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Fetch financial summary based on date range
  const fetchFinancialSummary = async () => {
    try {
      if (!isLoggedin || userRole !== 'admin') return;

      setLoading(true);
      const queryString = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }).toString();
      
      const response = await axios.get(
        `${API_BASE_URL}/api/finance/summary?${queryString}`
      );

      if (response.data.success) {
        setSummary(response.data.financialSummary);
      } else {
        toast.error('Failed to fetch financial summary');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Load all financial data when the component mounts
  useEffect(() => {
    const loadFinancialData = async () => {
      if (!isLoggedin || userRole !== 'admin') return;

      setLoading(true);
      try {
        await Promise.all([
          fetchFinancialKPIs(),
          fetchMonthlyData(),
          fetchFinancialSummary()
        ]);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    loadFinancialData();
  }, [isLoggedin, userRole]);

  // Reload financial summary when date range changes
  useEffect(() => {
    if (isLoggedin && userRole === 'admin') {
      fetchFinancialSummary();
    }
  }, [dateRange, isLoggedin, userRole]);

  // Handle filter change
  const handleFilterChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Generate PDF report
  const generatePDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 1,
      filename: `financial-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    // Show loading toast
    const toastId = toast.loading('Generating PDF report...');

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast.dismiss(toastId);
        toast.success('PDF report generated successfully!');
      })
      .catch((error) => {
        toast.dismiss(toastId);
        toast.error('Failed to generate PDF report');
        console.error('PDF generation error:', error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-6" ref={pdfRef}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FaFilePdf />
          {loading ? 'Loading...' : 'Download Report'}
        </button>
      </div>
      
      {/* KPI Summary Cards */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <FinancialKPI 
            title="Revenue" 
            value={`Rs ${kpis.revenue.current.toLocaleString()}`} 
            growth={kpis.revenue.growth} 
            icon={<FaChartLine className="text-blue-500" size={24} />} 
          />
          <FinancialKPI 
            title="Orders" 
            value={kpis.orders.current} 
            growth={kpis.orders.growth} 
            icon={<FaShoppingCart className="text-green-500" size={24} />} 
          />
          <FinancialKPI 
            title="Employees" 
            value={kpis.employees} 
            icon={<FaUserTie className="text-purple-500" size={24} />} 
          />
          <FinancialKPI 
            title="Profit" 
            value={`Rs ${kpis.profit.amount.toLocaleString()}`} 
            subValue={`${kpis.profit.margin}% margin`} 
            icon={<FaMoneyBillWave className="text-yellow-500" size={24} />} 
          />
        </div>
      )}
      
      {/* Revenue and Expenses Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Revenue vs Expenses (Last 12 Months)</h2>
        <RevenueExpenseChart data={monthlyData} />
      </div>
      
      {/* Financial Summary Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Financial Summary</h2>
          <FinancialFilter dateRange={dateRange} onFilterChange={handleFilterChange} />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <FinancialSummary summary={summary} />
        )}
      </div>
    </div>
  );
};

export default FinanceDashboard;