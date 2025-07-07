import Order from "../../models/order/order.model.js";
import Product from "../../models/inventory/product.model.js";
import userModel from "../../models/user/userModel.js"; // Importing the user model
import mongoose from "mongoose";
import { sendOrderConfirmationEmail } from "../../config/nodemailer.js";

// Re-register the User model with proper capitalization to match the references
// This ensures Mongoose can find the model when populating references
const User = userModel;

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        console.log("Creating order with data:", JSON.stringify(req.body));
        console.log("User:", req.user ? req.user._id : 'No user found');
        
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;
        
        // Check if order items exist and are not empty
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No order items"
            });
        }
        
        // Check if products exist and have enough stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product).session(session);
            
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.name} not found`
                });
            }
            
            if (product.quantity < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${item.name}. Available: ${product.quantity}`
                });
            }
            
            // Track inventory reduction
            const previousQuantity = product.quantity;
            
            // Reduce product quantity
            product.quantity -= item.quantity;
            
            // Record this inventory movement in product history
            product.trackInventoryChange(
                'order', 
                -item.quantity, 
                'New Order', 
                new mongoose.Types.ObjectId(), // Temporary ID until we have the order ID
                `Order placed by ${req.user.name} (${req.user.email})`
            );
            
            await product.save({ session });
            
            // Check if product is now low in stock or out of stock
            if (product.isOutOfStock || product.isLowStock) {
                console.log(`Product ${product.name} is now ${product.isOutOfStock ? 'out of stock' : 'low in stock'}`);
                // This could trigger notifications to admins in a future implementation
            }
        }
        
        // Create new order
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });
        
        const createdOrder = await order.save({ session });
        
        // Update all products' inventory history with the actual order ID
        for (const item of orderItems) {
            const product = await Product.findById(item.product).session(session);
            
            // Find the temporary inventory movement record and update with the real order ID
            const lastMovementIndex = product.inventoryHistory.findIndex(
                movement => movement.type === 'order' && movement.referenceId.toString() !== createdOrder._id.toString()
            );
            
            if (lastMovementIndex !== -1) {
                product.inventoryHistory[lastMovementIndex].referenceId = createdOrder._id;
                product.inventoryHistory[lastMovementIndex].reference = `Order #${createdOrder._id}`;
                await product.save({ session });
            }
        }
        
        await session.commitTransaction();
        session.endSession();
        
        // Send order confirmation email
        try {
            await sendOrderConfirmationEmail(req.user.email, {
                orderNumber: createdOrder._id,
                orderItems,
                totalPrice,
                userName: req.user.name
            });
        } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
            // Don't fail the request if email fails
        }
        
        return res.status(201).json({
            success: true,
            order: createdOrder
        });
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error creating order:', error);
        return res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email');
        
        // Check if order exists
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        // Check if the order belongs to the logged-in user or if the user is an admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "Not authorized to access this order"
            });
        }
        
        res.status(200).json({
            success: true,
            order
        });
        
    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving order",
            error: error.message
        });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
        
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving orders",
            error: error.message
        });
    }
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        // Update payment information
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        };
        
        const updatedOrder = await order.save();
        
        res.status(200).json({
            success: true,
            order: updatedOrder
        });
        
    } catch (error) {
        console.error('Error updating order payment status:', error);
        res.status(500).json({
            success: false,
            message: "Error updating order payment status",
            error: error.message
        });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        // Update delivery status
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = 'Delivered';
        
        const updatedOrder = await order.save();
        
        res.status(200).json({
            success: true,
            order: updatedOrder
        });
        
    } catch (error) {
        console.error('Error updating order delivery status:', error);
        res.status(500).json({
            success: false,
            message: "Error updating order delivery status",
            error: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { status } = req.body;
        
        if (!status || !['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }
        
        const order = await Order.findById(req.params.id).session(session);
        
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        const previousStatus = order.orderStatus;
        
        // Update order status
        order.orderStatus = status;
        
        // If status is "Delivered", also update isDelivered
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        
        // If status is "Cancelled" and it wasn't cancelled before, return items to inventory
        if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
            // Return quantities to inventory
            for (const item of order.orderItems) {
                const product = await Product.findById(item.product).session(session);
                if (product) {
                    // Add quantity back
                    product.quantity += item.quantity;
                    
                    // Record this inventory movement in product history
                    product.trackInventoryChange(
                        'return', 
                        item.quantity,
                        `Order Cancelled #${order._id}`, 
                        order._id,
                        `Order cancelled, item returned to inventory. Previous status: ${previousStatus}`
                    );
                    
                    await product.save({ session });
                    
                    console.log(`Returned ${item.quantity} of ${item.name} to inventory. New quantity: ${product.quantity}`);
                }
            }
        }
        
        const updatedOrder = await order.save({ session });
        
        await session.commitTransaction();
        session.endSession();
        
        res.status(200).json({
            success: true,
            order: updatedOrder
        });
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message
        });
    }
};

// @desc    Support filtering and pagination
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        // Support filtering and pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        
        // Build filter object
        const filter = {};
        
        // Filter by status if provided
        if (req.query.status && ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(req.query.status)) {
            filter.orderStatus = req.query.status;
        }
        
        // Filter by payment status if provided
        if (req.query.isPaid) {
            filter.isPaid = req.query.isPaid === 'true';
        }
        
        // Filter by delivery status if provided
        if (req.query.isDelivered) {
            filter.isDelivered = req.query.isDelivered === 'true';
        }
        
        // Filter by date range if provided
        if (req.query.startDate && req.query.endDate) {
            filter.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }
        
        // Text search if provided
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        
        // Get orders with filters and pagination
        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        // Get total count for pagination
        const totalOrders = await Order.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            count: orders.length,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
            orders
        });
        
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving orders",
            error: error.message
        });
    }
};

// @desc    Get order statistics (for admin dashboard)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
    try {
        // Safely parse date strings with error handling
        let startDate, endDate;
        try {
            startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
            endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
            
            // Validate if dates are valid
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error("Invalid date format");
            }
            
            // Make sure end date is not after current date
            const currentDate = new Date();
            if (endDate > currentDate) {
                endDate = currentDate;
            }
            
            // Make sure start date is not after end date
            if (startDate > endDate) {
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 30); // Default to 30 days before end date
            }
            
            // Add one day to end date to include orders from the end date
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
            endDate = adjustedEndDate;
            
            console.log(`Using date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
        } catch (dateError) {
            console.error("Date parsing error:", dateError);
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Please use YYYY-MM-DD format."
            });
        }
        
        // Initialize empty stats structure in case there are no orders
        const emptyStats = {
            totalRevenue: 0,
            totalOrders: 0,
            statusCounts: {
                Pending: 0,
                Processing: 0,
                Shipped: 0, 
                Delivered: 0,
                Cancelled: 0
            },
            dailyRevenue: [],
            recentOrders: []
        };
        
        // Get total number of orders within date range
        const totalOrdersCount = await Order.countDocuments({
            createdAt: { $gte: startDate, $lt: endDate }
        }).catch(err => {
            console.error("Error counting orders:", err);
            return 0;
        });
        
        // If there are no orders in the date range, return empty stats
        if (totalOrdersCount === 0) {
            // Generate empty daily revenue data for the date range
            const currentDate = new Date(startDate);
            while (currentDate < endDate) {
                emptyStats.dailyRevenue.push({
                    date: currentDate.toISOString().split('T')[0],
                    revenue: 0,
                    orderCount: 0
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            return res.status(200).json({
                success: true,
                stats: emptyStats
            });
        }
        
        // Order counts by status
        const statusCounts = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ]).catch(err => {
            console.error("Error aggregating status counts:", err);
            return [];
        });
        
        // Format status counts for easier frontend use
        const formattedStatusCounts = {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0
        };
        
        statusCounts.forEach(item => {
            if (item && item._id) {
                formattedStatusCounts[item._id] = item.count;
            }
        });
        
        // Total revenue in the period
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: endDate },
                    isPaid: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            }
        ]).catch(err => {
            console.error("Error aggregating revenue:", err);
            return [];
        });
        
        // Get daily revenue data - simpler approach
        const dailyRevenue = [];
        
        // Clone startDate to avoid modification
        const currentDate = new Date(startDate);
        
        // Loop through each day in the date range
        while (currentDate < endDate) {
            const dayStart = new Date(currentDate);
            const dayEnd = new Date(currentDate);
            dayEnd.setDate(dayEnd.getDate() + 1);
            
            try {
                // Query for orders on this specific day
                const dayOrders = await Order.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: dayStart, $lt: dayEnd }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            revenue: { 
                                $sum: { 
                                    $cond: [{ $eq: ["$isPaid", true] }, "$totalPrice", 0] 
                                } 
                            },
                            orderCount: { $sum: 1 }
                        }
                    }
                ]);
                
                // Format the day's data
                dailyRevenue.push({
                    date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                    revenue: dayOrders.length > 0 ? (dayOrders[0].revenue || 0) : 0,
                    orderCount: dayOrders.length > 0 ? (dayOrders[0].orderCount || 0) : 0
                });
            } catch (err) {
                console.error(`Error processing data for date ${currentDate}:`, err);
                // Add a zero entry for this day in case of error
                dailyRevenue.push({
                    date: currentDate.toISOString().split('T')[0],
                    revenue: 0,
                    orderCount: 0
                });
            }
            
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Recently placed orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)
            .catch(err => {
                console.error("Error fetching recent orders:", err);
                return [];
            });
        
        res.status(200).json({
            success: true,
            stats: {
                totalRevenue: revenueResult.length > 0 ? (revenueResult[0].totalRevenue || 0) : 0,
                totalOrders: totalOrdersCount || 0,
                statusCounts: formattedStatusCounts,
                dailyRevenue: dailyRevenue,
                recentOrders
            }
        });
        
    } catch (error) {
        console.error('Error retrieving order statistics:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving order statistics",
            error: error.message
        });
    }
};

// @desc    Get total price summation of all orders
// @route   GET /api/orders/total-price-summation
// @access  Private/Admin
export const getTotalPriceSummation = async (req, res) => {
    try {
        // Use aggregation pipeline to sum up all order prices
        const result = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                }
            }
        ]);

        // Return the results or 0 if no orders found
        res.status(200).json({
            success: true,
            totalAmount: result.length > 0 ? result[0].totalAmount : 0,
            orderCount: result.length > 0 ? result[0].orderCount : 0
        });
    } catch (error) {
        console.error('Error calculating total price summation:', error);
        res.status(500).json({
            success: false,
            message: "Error calculating total price summation",
            error: error.message
        });
    }
};

// @desc    Cancel my order (user function)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const order = await Order.findById(req.params.id).session(session);
        
        // Check if order exists
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        // Check if order belongs to user
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            await session.abortTransaction();
            session.endSession();
            return res.status(401).json({
                success: false,
                message: "Not authorized to cancel this order"
            });
        }
        
        // Check if order is cancellable (not delivered/shipped already)
        if (['Delivered', 'Shipped'].includes(order.orderStatus)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order in ${order.orderStatus} status`
            });
        }
        
        const previousStatus = order.orderStatus;
        
        // Update order status
        order.orderStatus = 'Cancelled';
        
        // Return quantities to inventory
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product).session(session);
            if (product) {
                // Add quantity back
                product.quantity += item.quantity;
                
                // Record this inventory movement in product history
                product.trackInventoryChange(
                    'return', 
                    item.quantity,
                    `Order Cancelled by User #${order._id}`, 
                    order._id,
                    `Order cancelled by ${req.user.name} (${req.user.email}). Previous status: ${previousStatus}`
                );
                
                await product.save({ session });
                
                console.log(`Returned ${item.quantity} of ${item.name} to inventory. New quantity: ${product.quantity}`);
            }
        }
        
        const updatedOrder = await order.save({ session });
        
        await session.commitTransaction();
        session.endSession();
        
        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: updatedOrder
        });
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: "Error cancelling order",
            error: error.message
        });
    }
};