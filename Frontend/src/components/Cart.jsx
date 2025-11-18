import { Navbar } from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Cart() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const cart = useCartStore((state) => state.cart);
  const getCartItems = useCartStore((state) => state.getCartItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCartLocal = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const [total, setTotal] = useState(0); // Initialize total as 0

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    // Calculate total whenever cart changes
    const calculatedTotal = getTotalPrice();
    setTotal(calculatedTotal);
  }, [cart]);

  console.log('Cart items:', cart);

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${productId}`, {
        withCredentials: true,
      });
      removeFromCartLocal(productId);
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Error removing item');
    }
  };

  const updateQuantityHandler = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `http://localhost:3000/cart/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      updateQuantity(productId, newQuantity); // Update Zustand state
      const newTotal = getTotalPrice(); // Recalculate total after quantity change
      setTotal(newTotal);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-gray-50 flex overflow-hidden">
        <aside className="w-[250px] bg-white shadow-lg p-6 flex flex-col items-center gap-4">
          <img
            src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
            alt="User Avatar"
            className="w-24 h-24 rounded-full bg-gray-200"
          />
          <h2 className="text-3xl font-semibold text-center">{user?.name}</h2>
          <p className="text-xl text-gray-500 text-center">{user?.email}</p>

          <div className="w-full mt-6 space-y-3">
            <button className="w-full text-xl text-left text-gray-600 hover:text-blue-600">Profile</button>
            <button className="w-full text-xl text-left text-gray-600 hover:text-blue-600">My Orders</button>
            <button
              onClick={() => {
                logout();
                navigate('/auth');
              }}
              className="w-full text-left text-xl text-red-500 hover:text-red-600 font-medium mt-4"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-90px)]">
          <h3 className="text-2xl font-semibold mb-5">My Cart</h3>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {cart.map((item) => {
                  if (!item.productId) return null;

                  const imageUrl = item.productId.image || 'fallback_image_url.jpg';
                  const price = item.productId.price;
                  const name = item.productId.name;

                  return (
                    <div key={item._id} className="bg-white p-4 shadow-md rounded-xl flex flex-col gap-2">
                      <img
                        src={imageUrl}
                        alt="Product"
                        className="w-full h-60 object-cover bg-red-700 rounded-md mb-3"
                      />
                      <p className="text-gray-600 font-bold">₹{price}</p>
                      <p className="text-gray-600 font-bold">{name}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantityHandler(item.productId._id, item.quantity - 1)}
                          className="px-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantityHandler(item.productId._id, item.quantity + 1)}
                          className="px-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId._id)}
                        className="text-xl text-red-500 hover:bg-red-500 hover:text-black font-medium mt-4 border-black border-2 rounded-lg px-4 py-2 outline-none"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-md max-w-md ml-auto">
                <h4 className="text-xl font-bold mb-4">Cart Summary</h4>
                <div className="flex justify-between text-lg mb-2">
                  <p>Total Price: ₹{total.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    toast.success('Proceeding to checkout...');
                    navigate('/checkout');
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 mt-4"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
