import { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], totalItems: 0, totalPrice: 0 };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1, fabricMeasurement = null) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product === product._id && 
        // For fabric, check if it's the same measurement
        (product.category !== 'fabric' || item.fabricMeasurement === fabricMeasurement)
      );

      let newItems = [...prevCart.items];
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          // Update total price for this item
          price: product.price,
          totalPrice: product.price * (
            product.category === 'fabric' ? 
              fabricMeasurement * (newItems[existingItemIndex].quantity + quantity) : 
              (newItems[existingItemIndex].quantity + quantity)
          )
        };
      } else {
        // Add new item
        newItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          category: product.category,
          quantity: quantity,
          fabricMeasurement: product.category === 'fabric' ? fabricMeasurement : null,
          totalPrice: product.price * (product.category === 'fabric' ? fabricMeasurement * quantity : quantity)
        });
      }

      // Calculate new totals
      const newTotalItems = newItems.reduce((total, item) => total + item.quantity, 0);
      const newTotalPrice = newItems.reduce((total, item) => total + item.totalPrice, 0);

      return {
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice
      };
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, fabricMeasurement = null) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => item.product !== productId || 
        // For fabric, also check measurement
        (item.category === 'fabric' && item.fabricMeasurement !== fabricMeasurement)
      );
      
      // Calculate new totals
      const newTotalItems = newItems.reduce((total, item) => total + item.quantity, 0);
      const newTotalPrice = newItems.reduce((total, item) => total + item.totalPrice, 0);

      return {
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice
      };
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity, fabricMeasurement = null) => {
    if (quantity < 1) return;
    
    setCart(prevCart => {
      const itemIndex = prevCart.items.findIndex(
        item => item.product === productId && 
        // For fabric, check if it's the same measurement
        (item.category !== 'fabric' || item.fabricMeasurement === fabricMeasurement)
      );

      if (itemIndex === -1) return prevCart;

      const newItems = [...prevCart.items];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        quantity: quantity,
        totalPrice: newItems[itemIndex].price * 
          (newItems[itemIndex].category === 'fabric' ? 
            newItems[itemIndex].fabricMeasurement * quantity : quantity)
      };

      // Calculate new totals
      const newTotalItems = newItems.reduce((total, item) => total + item.quantity, 0);
      const newTotalPrice = newItems.reduce((total, item) => total + item.totalPrice, 0);

      return {
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice
      };
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easier access to the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};