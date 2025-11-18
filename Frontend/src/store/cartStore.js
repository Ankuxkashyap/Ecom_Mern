import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [], // ✅ must be an array

  getCartItems: async () => {
  const response = await fetch('http://localhost:3000/cart', {
    credentials: 'include',
  });
  const data = await response.json();
  set({ cart: data.items || [] });  // Use data.items, fallback to empty array
},

  updateQuantity: (productId, newQty) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId._id === productId ? { ...item, quantity: newQty } : item
      ),
    }));
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.productId._id !== productId),
    }));
  },

  getTotalPrice: () => {
  const cart = get().cart;
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);
},
}));
