import Employee from '../../models/user/employeeModel.js';
import Order from '../../models/order/order.model.js';

// Get financial summary including employee salaries and order revenues
export const getFinancialSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Build date filter
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Get order revenue data
        const orderSummary = await getOrderFinancialData(dateFilter);
        
        // Get employee salary data
        const salarySummary = await getEmployeeSalaryData(dateFilter);

        // Calculate profit/loss
        const totalRevenue = orderSummary.totalRevenue;
        const totalExpenses = salarySummary.totalSalaries;
        const profitLoss = totalRevenue - totalExpenses;

        res.status(200).json({
            success: true,
            financialSummary: {
                period: {
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null,
                },
                orders: orderSummary,
                salaries: salarySummary,
                overview: {
                    totalRevenue,
                    totalExpenses,
                    profitLoss,
                    profitMargin: totalRevenue ? ((profitLoss / totalRevenue) * 100).toFixed(2) : 0
                }
            }
        });
    } catch (error) {
        console.error('Error generating financial summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating financial summary',
            error: error.message
        });
    }
};

// Get order financial data
const getOrderFinancialData = async (dateFilter) => {
    // Get all orders within date range without filtering by status
    const orders = await Order.find({
        ...dateFilter
    });
    
    // Calculate total potential revenue from all orders
    const totalPotentialRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate revenue from non-cancelled orders
    const activeRevenue = orders
        .filter(order => order.orderStatus !== 'Cancelled')
        .reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate revenue from paid orders
    const paidRevenue = orders
        .filter(order => order.isPaid)
        .reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate revenue from delivered orders
    const deliveredRevenue = orders
        .filter(order => order.orderStatus === 'Delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate revenue from cancelled orders
    const cancelledRevenue = orders
        .filter(order => order.orderStatus === 'Cancelled')
        .reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate revenue by payment method
    const revenueByPaymentMethod = {};
    orders.forEach(order => {
        const method = order.paymentMethod || 'Unknown';
        if (!revenueByPaymentMethod[method]) {
            revenueByPaymentMethod[method] = 0;
        }
        revenueByPaymentMethod[method] += order.totalPrice;
    });
    
    // Get monthly revenue 
    const monthlyRevenue = {};
    orders.forEach(order => {
        const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = {
                total: 0,
                paid: 0,
                cancelled: 0
            };
        }
        monthlyRevenue[month].total += order.totalPrice;
        
        if (order.isPaid) {
            monthlyRevenue[month].paid += order.totalPrice;
        }
        
        if (order.orderStatus === 'Cancelled') {
            monthlyRevenue[month].cancelled += order.totalPrice;
        }
    });
    
    // Calculate revenue by order status
    const revenueByStatus = {};
    orders.forEach(order => {
        const status = order.orderStatus || 'Unknown';
        if (!revenueByStatus[status]) {
            revenueByStatus[status] = 0;
        }
        revenueByStatus[status] += order.totalPrice;
    });
    
    // Order count by status
    const orderCountByStatus = {};
    orders.forEach(order => {
        const status = order.orderStatus || 'Unknown';
        if (!orderCountByStatus[status]) {
            orderCountByStatus[status] = 0;
        }
        orderCountByStatus[status]++;
    });
    
    // Order count and average order value
    const orderCount = orders.length;
    const activeOrderCount = orders.filter(order => order.orderStatus !== 'Cancelled').length;
    const avgOrderValue = orderCount ? totalPotentialRevenue / orderCount : 0;

    return {
        totalPotentialRevenue,
        activeRevenue,
        paidRevenue,
        deliveredRevenue,
        cancelledRevenue,
        orderCount,
        activeOrderCount,
        avgOrderValue,
        revenueByPaymentMethod,
        monthlyRevenue,
        revenueByStatus,
        orderCountByStatus,
        paymentSummary: {
            paid: paidRevenue,
            unpaid: activeRevenue - paidRevenue,
            paidPercentage: activeRevenue ? ((paidRevenue / activeRevenue) * 100).toFixed(2) : 0
        }
    };
};

// Get employee salary data
const getEmployeeSalaryData = async (dateFilter) => {
    // Get all employees with salary data
    const employees = await Employee.find({
        'salary.netSalary': { $gt: 0 }
    });
    
    // Calculate salary summary
    let filteredSalaryHistory = [];
    
    if (dateFilter.createdAt) {
        // Filter salary history entries by date
        employees.forEach(emp => {
            if (emp.salary && emp.salary.history) {
                const filteredHistory = emp.salary.history.filter(record => {
                    const recordDate = new Date(record.date);
                    let match = true;
                    
                    if (dateFilter.createdAt.$gte) {
                        match = match && recordDate >= new Date(dateFilter.createdAt.$gte);
                    }
                    
                    if (dateFilter.createdAt.$lte) {
                        match = match && recordDate <= new Date(dateFilter.createdAt.$lte);
                    }
                    
                    return match;
                });
                
                filteredSalaryHistory = [...filteredSalaryHistory, ...filteredHistory];
            }
        });
    } else {
        // Use all salary history
        employees.forEach(emp => {
            if (emp.salary && emp.salary.history) {
                filteredSalaryHistory = [...filteredSalaryHistory, ...emp.salary.history];
            }
        });
    }
    
    // Calculate total salaries from filtered history
    const totalSalaries = filteredSalaryHistory.reduce((sum, record) => sum + record.netSalary, 0);
    
    // Calculate department-wise salary expenditure
    const departmentSalaries = {};
    employees.forEach(emp => {
        if (emp.salary && emp.salary.netSalary > 0) {
            if (!departmentSalaries[emp.department]) {
                departmentSalaries[emp.department] = 0;
            }
            departmentSalaries[emp.department] += emp.salary.netSalary;
        }
    });
    
    // Employee count with salaries
    const employeeCount = employees.length;
    const avgSalary = employeeCount ? totalSalaries / employeeCount : 0;

    return {
        totalSalaries,
        employeeCount,
        avgSalary,
        departmentSalaries,
    };
};

// Get monthly finance data for dashboard
export const getMonthlyFinanceData = async (req, res) => {
    try {
        // Get current date and date from 12 months ago
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        
        // Generate monthly data for the past 12 months
        const monthlyData = [];
        
        for (let i = 0; i < 12; i++) {
            const month = new Date(endDate);
            month.setMonth(month.getMonth() - i);
            
            const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
            const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
            
            // Get all orders for this month without filtering by payment status
            const orders = await Order.find({
                createdAt: { $gte: monthStart, $lte: monthEnd }
            });
            
            // Calculate total revenue from all orders
            const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
            
            // Calculate paid revenue only (for comparison)
            const paidRevenue = orders
                .filter(order => order.isPaid)
                .reduce((sum, order) => sum + order.totalPrice, 0);
            
            // Get salary expenses for this month
            const employees = await Employee.find({
                'salary.netSalary': { $gt: 0 }
            });
            
            const expenses = employees.reduce((sum, emp) => sum + (emp.salary?.netSalary || 0), 0);
            
            monthlyData.unshift({
                month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
                revenue,
                paidRevenue,
                expenses,
                profit: revenue - expenses,
                orderCount: orders.length
            });
        }
        
        res.status(200).json({
            success: true,
            monthlyData
        });
    } catch (error) {
        console.error('Error generating monthly finance data:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating monthly finance data',
            error: error.message
        });
    }
};

// Get financial KPIs
export const getFinancialKPIs = async (req, res) => {
    try {
        // Get current date and date from 30 days ago
        const today = new Date();
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        
        const previous30Days = new Date(last30Days);
        previous30Days.setDate(previous30Days.getDate() - 30);
        
        // Revenue in last 30 days - include all orders
        const currentOrders = await Order.find({
            createdAt: { $gte: last30Days, $lte: today }
        });
        
        const currentRevenue = currentOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const currentOrderCount = currentOrders.length;
        
        // Revenue in previous 30 days for comparison - include all orders
        const previousOrders = await Order.find({
            createdAt: { $gte: previous30Days, $lte: last30Days }
        });
        
        const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        const previousOrderCount = previousOrders.length;
        
        // Calculate growth percentages
        const revenueGrowth = previousRevenue ? 
            ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2) : 100;
            
        const orderCountGrowth = previous30Days ? 
            ((currentOrderCount - previousOrderCount) / previousOrderCount * 100).toFixed(2) : 100;
        
        // Total employees with active salaries
        const employees = await Employee.countDocuments({
            'salary.netSalary': { $gt: 0 },
            'status': 'active'
        });
        
        // Total salary expense
        const totalSalaryExpense = await Employee.aggregate([
            { $match: { 'salary.netSalary': { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: '$salary.netSalary' } } }
        ]);
        
        const monthlySalaryExpense = totalSalaryExpense.length > 0 ? totalSalaryExpense[0].total : 0;
        
        // Current profit/loss estimate
        const profit = currentRevenue - monthlySalaryExpense;
        const profitMargin = currentRevenue ? (profit / currentRevenue * 100).toFixed(2) : 0;
        
        res.status(200).json({
            success: true,
            kpis: {
                revenue: {
                    current: currentRevenue,
                    previous: previousRevenue,
                    growth: revenueGrowth
                },
                orders: {
                    current: currentOrderCount,
                    previous: previousOrderCount,
                    growth: orderCountGrowth
                },
                employees: employees,
                salaryExpense: monthlySalaryExpense,
                profit: {
                    amount: profit,
                    margin: profitMargin
                },
                period: {
                    current: {
                        start: last30Days,
                        end: today
                    },
                    previous: {
                        start: previous30Days,
                        end: last30Days
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error generating financial KPIs:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating financial KPIs',
            error: error.message
        });
    }
};