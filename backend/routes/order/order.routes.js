import express from 'express';
import { 
    createOrder,
    getOrderById,
    getMyOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderStatus,
    getOrders,
    getOrderStats,
    cancelOrder,
    getTotalPriceSummation
} from '../../controllers/order/order.controller.js';
import { protect } from '../../middleware/authMiddleware.js';
import { isAdmin } from '../../middleware/adminAuth.js';

const router = express.Router();

// User routes
router.route('/')
    .post(protect, createOrder)     // Create new order
    .get(protect, isAdmin, getOrders); // Get all orders (admin only)

router.route('/myorders')
    .get(protect, getMyOrders);  // Get logged in user's orders

router.route('/stats')
    .get(protect, isAdmin, getOrderStats); // Get order statistics (admin only)

// Income statistics route
router.route('/income')
    .get(protect, isAdmin, getOrderStats); // Using the same controller for now

// Total price summation route
router.route('/total-price-summation')
    .get(protect, isAdmin, getTotalPriceSummation); // Get total price summation (admin only)

router.route('/:id')
    .get(protect, getOrderById); // Get order details

router.route('/:id/pay')
    .put(protect, updateOrderToPaid); // Mark order as paid

router.route('/:id/deliver')
    .put(protect, isAdmin, updateOrderToDelivered); // Mark order as delivered (admin only)

router.route('/:id/status')
    .put(protect, isAdmin, updateOrderStatus); // Update order status (admin only)

router.route('/:id/cancel')
    .put(protect, cancelOrder); // Cancel an order

export default router;