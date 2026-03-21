// Context quản lý giỏ hàng và wishlist — đồng bộ với backend khi đã đăng nhập
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI, wishlistAPI } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems]     = useState([]);
  const [cartTotal, setCartTotal]     = useState(0);
  const [wishlist, setWishlist]       = useState([]); // array of product_ids
  const [cartLoading, setCartLoading] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem('token');

  // ── Cart ──
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      setCartLoading(true);
      const res = await cartAPI.getCart();
      setCartItems(res.data?.items || []);
      setCartTotal(res.data?.total || 0);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // ── Wishlist ──
  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const res = await wishlistAPI.getWishlist();
      const items = res.data?.items || [];
      setWishlist(items.map(i => i.product_id || i.id));
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchWishlist();
    // Re-sync when token changes (login/logout)
    const onStorage = (e) => {
      if (e.key === 'token') {
        if (e.newValue) { fetchCart(); fetchWishlist(); }
        else { setCartItems([]); setCartTotal(0); setWishlist([]); }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [fetchCart, fetchWishlist]);

  // ── Add to cart ──
  const addToCart = useCallback(async (product, size, quantity = 1) => {
    if (!isLoggedIn()) {
      // Local fallback cho guest
      setCartItems(prev => {
        const existing = prev.find(i => i.id === product.id && i.size === size);
        if (existing) return prev.map(i => i.id === product.id && i.size === size ? { ...i, quantity: i.quantity + quantity } : i);
        return [...prev, { ...product, size, quantity }];
      });
      return;
    }
    try {
      const variantId = product.variants?.find(v => `${v.volume_ml}ml` === size)?.id
                     || product.variants?.[0]?.id;
      if (!variantId) {
        console.warn('No variant found for', product.name, size);
        return;
      }
      await cartAPI.addItem({ product_id: product.id, variant_id: variantId, quantity });
      await fetchCart();
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    if (!isLoggedIn()) {
      setCartItems(prev => prev.filter(i => i.id !== itemId));
      return;
    }
    await cartAPI.removeItem(itemId);
    await fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity < 1) return removeFromCart(itemId);
    if (!isLoggedIn()) {
      setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
      return;
    }
    await cartAPI.updateItem(itemId, quantity);
    await fetchCart();
  }, [fetchCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (isLoggedIn()) await cartAPI.clearCart();
    setCartItems([]);
    setCartTotal(0);
  }, []);

  // ── Wishlist toggle ──
  const toggleWishlist = useCallback(async (productId) => {
    if (!isLoggedIn()) {
      setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
      return;
    }
    // Optimistic update
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    try {
      await wishlistAPI.toggle(productId);
    } catch {
      // Revert on error
      setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    }
  }, []);

  const cartCount     = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider value={{
      cartItems, cartTotal, cartLoading, fetchCart,
      addToCart, removeFromCart, updateQuantity, clearCart,
      wishlist, toggleWishlist, wishlistCount, cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
