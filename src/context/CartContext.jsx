import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

// ─────────────────────────────────────────
// Helper: normalize product from API to cart item shape
// API uses: name, daily_rate — Frontend was using: title, price
// ─────────────────────────────────────────
const normalizeProduct = (product) => ({
  id: product.id,
  title: product.name || product.title,
  price: product.daily_rate || product.price,
  dailyRate: Number(product.daily_rate || product.price),
  category: product.category || product.category_name || 'Gear',
  brand: product.brand || product.brand_name || '',
  image: product.image || product.image_url || '',
  image_url: product.image_url || product.image || '',
  deposit_amount: product.deposit_amount || null,
  ...product,
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Rental dates — stored here so both Header and CartSlideOver can access them
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultEnd = new Date(today);
  defaultEnd.setDate(today.getDate() + 6);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);

  // Add item to cart (works with both API products and local dummy products)
  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === normalized.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === normalized.id ? { ...item, days: item.days + 1 } : item
        );
      }
      return [...prevItems, { ...normalized, days: 1 }];
    });
  };

  // Remove item
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Update rental days
  const updateDays = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newDays = item.days + change;
          return { ...item, days: newDays > 0 ? newDays : 1 };
        }
        return item;
      })
    );
  };

  // Clear entire cart (called after successful rental submission)
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateDays,
        clearCart,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};