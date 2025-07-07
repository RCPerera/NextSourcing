import mongoose from 'mongoose';
import Product from '../../models/inventory/product.model.js';

export const getProducts = async (req, res) => {
    try {
        // Extract query parameters for filtering and sorting
        const { 
            category, 
            search, 
            sort, 
            color, 
            fabricType,
            minPrice,
            maxPrice
        } = req.query;
        
        // Build query filter
        const filter = {};
        
        // Filter by category if provided
        if (category && ['fabric', 'product'].includes(category)) {
            filter.category = category;
        }
        
        // Filter by color for fabrics
        if (color && category === 'fabric') {
            filter.color = { $regex: color, $options: 'i' }; // Case-insensitive
        }
        
        // Filter by fabric type for fabrics
        if (fabricType && category === 'fabric') {
            filter.fabricType = { $regex: fabricType, $options: 'i' }; // Case-insensitive
        }
        
        // Filter by price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
        }
        
        // Search functionality (using text index)
        if (search) {
            filter.$text = { $search: search };
        }
        
        // Build sorting options
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    sortOption = { price: 1 };
                    break;
                case 'price_desc':
                    sortOption = { price: -1 };
                    break;
                case 'newest':
                    sortOption = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortOption = { createdAt: 1 };
                    break;
                default:
                    sortOption = { createdAt: -1 }; // Default to newest
            }
        } else {
            // Default sort by newest
            sortOption = { createdAt: -1 };
        }
        
        // Execute query with filters and sort
        const products = await Product.find(filter).sort(sortOption);
        
        res.status(200).json({ 
            success: true, 
            count: products.length, 
            data: products 
        });
    } catch(error) {
        console.log("Error in get products", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.log("Error in get product by id", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const createProduct = async(req,res) => {
    const product = req.body;

    // Validate required fields based on category
    if (!product.name || !product.price || !product.image || !product.category || product.quantity === undefined) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    
    // Additional validation for fabric category
    if (product.category === 'fabric' && (!product.color || !product.fabricType)) {
        return res.status(400).json({ success: false, message: 'Color and fabric type are required for fabrics' });
    }

    const newProduct = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in create product", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const updateProduct = async(req,res) => {
    const {id} = req.params;
    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    try{
        // Get the current product to check its category
        const currentProduct = await Product.findById(id);
        
        if (!currentProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // If changing to fabric category, ensure required fields are present
        if (product.category === 'fabric' && (!product.color || !product.fabricType)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Color and fabric type are required for fabrics' 
            });
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        
        res.status(200).json({ success: true, data: updatedProduct });
    } catch(error) {
        console.error("Error in update product", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteProduct = async(req,res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    
    try {
        const result = await Product.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch(error) {
        console.error("Error in delete product", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

// @desc    Get inventory movements for a product
// @route   GET /api/products/:id/inventory-history
// @access  Private/Admin
export const getInventoryMovements = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Sort inventory history by date in descending order (newest first)
        const inventoryHistory = product.inventoryHistory.sort((a, b) => b.date - a.date);
        
        res.status(200).json({ 
            success: true, 
            productName: product.name,
            currentQuantity: product.quantity,
            inventoryHistory
        });
    } catch (error) {
        console.error("Error getting inventory movements", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add inventory (restock)
// @route   POST /api/products/:id/restock
// @access  Private/Admin
export const restockProduct = async (req, res) => {
    const { id } = req.params;
    const { quantity, notes } = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid quantity greater than zero' 
            });
        }
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Track the inventory change
        product.trackInventoryChange(
            'restock',
            Number(quantity),
            'Inventory Restock',
            new mongoose.Types.ObjectId(),
            notes || 'Manual restock by admin'
        );
        
        // Update the product quantity
        product.quantity += Number(quantity);
        
        await product.save();
        
        res.status(200).json({ 
            success: true, 
            message: `Successfully added ${quantity} items to inventory`,
            newQuantity: product.quantity,
            product
        });
    } catch (error) {
        console.error("Error restocking inventory", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Adjust inventory (can be positive or negative)
// @route   POST /api/products/:id/adjust-inventory
// @access  Private/Admin
export const adjustInventory = async (req, res) => {
    const { id } = req.params;
    const { adjustment, reason } = req.body;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }
        
        if (!adjustment || isNaN(adjustment) || adjustment === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid adjustment value (positive or negative)' 
            });
        }
        
        if (!reason || reason.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a reason for the adjustment' 
            });
        }
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        // Check if adjustment would result in negative inventory
        if (product.quantity + Number(adjustment) < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Adjustment would result in negative inventory' 
            });
        }
        
        // Track the inventory change
        product.trackInventoryChange(
            'adjustment',
            Number(adjustment),
            'Inventory Adjustment',
            new mongoose.Types.ObjectId(),
            reason
        );
        
        // Update the product quantity
        product.quantity += Number(adjustment);
        
        await product.save();
        
        res.status(200).json({ 
            success: true, 
            message: `Successfully adjusted inventory by ${adjustment} items`,
            newQuantity: product.quantity,
            product
        });
    } catch (error) {
        console.error("Error adjusting inventory", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private/Admin
export const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            $or: [
                { isLowStock: true },
                { isOutOfStock: true }
            ]
        }).sort({ quantity: 1 });
        
        const outOfStock = products.filter(product => product.quantity <= 0);
        const lowStock = products.filter(product => product.quantity > 0 && product.quantity <= product.lowStockThreshold);
        
        res.status(200).json({ 
            success: true, 
            count: products.length,
            outOfStockCount: outOfStock.length,
            lowStockCount: lowStock.length, 
            data: products 
        });
    } catch (error) {
        console.error("Error getting low stock products", error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};