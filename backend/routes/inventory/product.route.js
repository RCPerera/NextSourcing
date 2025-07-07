import express from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    deleteProduct, 
    updateProduct,
    getInventoryMovements,
    restockProduct,
    adjustInventory,
    getLowStockProducts
} from '../../controllers/inventory/product.controller.js';
import { protect } from '../../middleware/authMiddleware.js';
import { isAdmin } from '../../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

// Inventory management routes (admin only)
router.get('/inventory/low-stock', protect, isAdmin, getLowStockProducts);
router.get('/:id/inventory-history', protect, isAdmin, getInventoryMovements);
router.post('/:id/restock', protect, isAdmin, restockProduct);
router.post('/:id/adjust-inventory', protect, isAdmin, adjustInventory);

export default router;