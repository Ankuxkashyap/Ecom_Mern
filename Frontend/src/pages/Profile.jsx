import { useAuthStore } from '../store/authStore';
import { Navbar } from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from '../components/OrderCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?._id]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const endpoint = user?.isAdmin
        ? 'http://localhost:3000/order'
        : `http://localhost:3000/order/${user.id}`;
  
      const res = await axios.get(endpoint, {
        withCredentials: true,
      });

      // console.log('Orders response:', res.data);
      const ordersData = Array.isArray(res.data) ? res.data : res.data.orders;

      setOrders(ordersData || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/order/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success('Order status updated');
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (orderId) => {
    try {

      const res = await axios.delete(`http://localhost:3000/order/${orderId}`, {
        withCredentials: true,
      });
      console.log('Delete response:', res.data);
      toast.success('Order deleted');
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-gray-50 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[250px] bg-white shadow-lg p-6 flex flex-col items-center gap-4">
          <img
            src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
            alt="User Avatar"
            className="w-24 h-24 rounded-full bg-gray-200"
          />
          <h2 className="text-3xl font-semibold text-center">{user?.name}</h2>
          <p className="text-xl text-gray-500 text-center">{user?.email}</p>
          <div className="w-full mt-6 space-y-3">
            <button className="w-full text-xl text-left text-blue-600 font-medium cursor-pointer">
              Profile
            </button>
            <button
              className="w-full text-xl text-left text-gray-600 hover:text-blue-600 cursor-pointer"
              onClick={fetchOrders}
            >
              {user?.isAdmin ? 'All Orders' : 'My Orders'}
            </button>
            {user?.isAdmin && (
              <button
                className="w-full text-xl text-left text-gray-600 hover:text-blue-600 cursor-pointer"
                onClick={() => navigate('/add-product')}
              >
                Add Product
              </button>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
               className="w-full text-left text-xl text-red-500 hover:text-red-600 font-medium mt-4 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-90px)]">
          <h3 className="text-2xl font-semibold mb-4">My Orders</h3>

          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  user={user}
                  refreshOrders={fetchOrders}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
