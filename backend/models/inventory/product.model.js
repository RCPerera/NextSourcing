import mongoose from "mongoose";

// Define inventory movement schema to track product quantity changes
const inventoryMovementSchema = new mongoose.Schema({
   type: {
      type: String,
      enum: ['order', 'restock', 'adjustment', 'return'],
      required: true
   },
   quantity: {
      type: Number,
      required: true
   },
   reference: {
      type: String,
      required: true
   },
   referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
   },
   date: {
      type: Date,
      default: Date.now
   },
   notes: {
      type: String
   },
   previousQuantity: {
      type: Number,
      required: true
   },
   newQuantity: {
      type: Number,
      required: true
   }
});

const productSchema = new mongoose.Schema({
   name:{
    type: String,
    required: true
   },
   
   price:{
    type: Number,
    required: true
   },
   
   image:{
    type: String,
    required: true
   },
   
   category: {
    type: String,
    required: true,
    enum: ['fabric', 'product'],
    default: 'product'
   },
   
   quantity: {
    type: Number,
    required: true,
    default: 0
   },
   
   // For fabric category
   color: {
    type: String,
    required: function() { return this.category === 'fabric'; }
   },
   
   fabricType: {
    type: String,
    required: function() { return this.category === 'fabric'; }
   },
   
   // Optional fields for both categories
   description: {
    type: String
   },
   
   featured: {
    type: Boolean,
    default: false
   },

   // Inventory management fields
   lowStockThreshold: {
      type: Number,
      default: 10
   },
   
   // Inventory movement history
   inventoryHistory: [inventoryMovementSchema],
   
   // Reorder point (when to reorder more inventory)
   reorderPoint: {
      type: Number,
      default: 5
   },

   // Status flags
   isLowStock: {
      type: Boolean,
      default: false
   },
   
   isOutOfStock: {
      type: Boolean,
      default: true
   }
},{
    timestamps: true
});

// Add text index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text',
  color: 'text', 
  fabricType: 'text'
});

// Pre-save middleware to update stock status flags
productSchema.pre('save', function(next) {
   // Update stock status flags
   this.isOutOfStock = this.quantity <= 0;
   this.isLowStock = this.quantity > 0 && this.quantity <= this.lowStockThreshold;
   next();
});

// Method to track inventory movements
productSchema.methods.trackInventoryChange = function(type, quantity, reference, referenceId, notes = '') {
   const previousQuantity = this.quantity;
   
   // Create inventory movement record
   this.inventoryHistory.push({
      type,
      quantity,
      reference,
      referenceId,
      previousQuantity,
      newQuantity: previousQuantity + quantity, // Quantity can be negative for reductions
      notes,
      date: new Date()
   });
};

const Product = mongoose.model('Product', productSchema);

export default Product;