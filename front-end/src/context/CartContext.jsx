import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addItem({ productId, quantity });
      setCart(response.data.data);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateItem(itemId, { quantity });
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Không thể cập nhật giỏ hàng' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeItem(itemId);
      setCart(response.data.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Không thể xóa sản phẩm' 
      };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Không thể xóa giỏ hàng' 
      };
    }
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartItemsCount: cart?.totalItems || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

