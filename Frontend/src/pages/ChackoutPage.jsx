import { useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { user } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const navigate = useNavigate();

  const [address, setAddress] = useState('');

  const paymentMode = "Stripe"; // Fixed to Stripe only
  

  useEffect(() => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      navigate('/cart');
    }
  }, [cart, navigate]);

  const placeOrder = async () => {
    if (!address.trim()) {
      return toast.error('Please enter your address');
    }

    const totalPrice = getTotalPrice();
    console.log('Total Price:', totalPrice);
    const products = cart.map((item) => ({
      name: item.productId?.name || 'Unnamed Product',
      price: item.productId?.price || 0,
      quantity: item.quantity,
    }));

    const orderData = {
      products,
      address,
      totalPrice,
      paymentMethod: paymentMode,   
    };

    try {
      // Always Stripe payment
      const res = await axios.post("http://localhost:3000/payment", orderData, {
        withCredentials: true,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
        await axios.post('http://localhost:3000/order', orderData, {
          withCredentials: true,
        });
      } else {
        toast.error("Failed to initiate Stripe payment");
      }

      removeFromCart(products.map(item => item.productId._id)); 

    } catch (error) {
      console.error('Error placing order:', error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-1/2 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>

        {/* Address Input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Delivery Address</label>
          <textarea
            rows={3}
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full delivery address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Payment Method (Stripe fixed, no selection) */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Payment Method</label>
          <div className="text-green-700 font-semibold">
            Stripe (Online Payment)
          </div>
        </div>

        {/* Order Items */}
        <ul className="mb-4 space-y-2">
          {cart.map((item) => (
            <li key={item.productId?._id || item._id} className="flex justify-between">
              <span>{item.productId?.name || 'Unnamed Product'} × {item.quantity}</span>
              <span>₹{(item.productId?.price || 0) * item.quantity}</span>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{getTotalPrice()}</span>
        </div>

        {/* Submit Button */}
        <button
          onClick={placeOrder}
          className="w-full mt-6 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
