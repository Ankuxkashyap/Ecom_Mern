import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OrderCard({ order, refreshOrders }) {
  const { user } = useAuthStore();
  const [status, setStatus] = useState(order.status);

  console.log("OrderCard order:", order);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await axios.put(
        `http://localhost:3000/order/${order._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      // console.log("Status update response:", res.data);
      toast.success("Order status updated");
      // refreshOrders(); // Refetch orders
    } catch (error) {
      console.error("Failed to update status:", error);
      // toast.error("Failed to update order status");
    }
  };
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/order", {
        withCredentials: true,
      });
    } catch (err) {
      // console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/order/${order._id}`, {
        withCredentials: true,
      });
      toast.success("Order deleted successfully");
      // refreshOrders(); // Refetch orders
    } catch (error) {
      console.error("Failed to delete order:", error);
      // toast.error("Failed to delete order");
    }
  };

  const statusColor =
    status === "Pending"
      ? "bg-red-500"
      : status === "Shipped"
      ? "bg-blue-500"
      : status === "Canceled"
      ? "bg-yellow-500"
      : status === "Delivered"
      ? "bg-green-600"
      : "bg-gray-400";

  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
      <h4 className="font-semibold text-xl">Order ID: #{order._id.slice(-6)}</h4>
      <p className="text-lg text-gray-600 mt-1">Total: ₹{order.totalPrice}</p>
      <p className="text-lg text-gray-600 mt-1">Address: {order.address}</p>
      <p className="text-lg text-gray-600 mt-1">Payment Mode: {order.paymentMethod}</p>

      <p className="text-lg text-gray-500 mt-1">
        Status:{" "}
        <span
          className={`px-2 py-1 rounded text-white text-sm font-medium ${statusColor}`}
        >
          {status}
        </span>
      </p>

      <ul className="mt-3 space-y-1 text-sm">
        {order.items?.map((item, i) => (
          <li key={i} className="text-gray-700">
            • {item.name} x {item.quantity}
          </li>
        ))}
      </ul>

      {user?.isAdmin && (
        <div className="mt-4 space-y-2">
          <select
            value={status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Canceled">Canceled</option>
            <option value="Delivered">Delivered</option>
          </select>

          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2 text-sm"
          >
            Delete Order
          </button>
        </div>
      )}
    </div>
  );
}
