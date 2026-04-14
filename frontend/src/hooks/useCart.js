import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export function useCart() {
  return (
    useContext(CartContext) || {
      cartItems: [],
      cartTotal: 0,
      cartLoading: false,
      fetchCart: async () => {},
      addToCart: async () => {},
      removeFromCart: async () => {},
      updateQuantity: async () => {},
      clearCart: async () => {},
      wishlist: [],
      toggleWishlist: async () => {},
      wishlistCount: 0,
      cartCount: 0,
    }
  );
}
