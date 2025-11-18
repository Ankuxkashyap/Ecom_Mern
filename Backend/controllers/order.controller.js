    import Order from '../models/order.model.js';

// POST /api/orders → create new order
export const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { products, totalPrice, address, paymentMethod } = req.body;
  console.log(totalPrice)
  try {
    const newOrder = new Order({
      user: userId,
      products,
      totalPrice,
      address,
      paymentMethod,
    });

    await newOrder.save();
    console.log("Order placed successfully:", newOrder);
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};


// GET /api/orders/:id → get specific order by ID
export const getOrderById = async (req, res) => {
   try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// GET /api/orders → get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// PUT /api/orders/:id → update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();
    // console.log("Order status updated:", order);
    
    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order", error: err.message });
  }
};

// DELETE /api/orders/:id → delete order (admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
};
