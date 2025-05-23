    import Order from '../models/order.model.js';

// POST /api/orders → create new order
export const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { products, totalPrice, address, paymentMethod } = req.body;

  try {
    const newOrder = new Order({
      user: userId,
      products,
      totalPrice,
      address,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

// GET /api/orders/my-orders → get orders of logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// GET /api/orders/:id → get specific order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow access to the owner or admin
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to get order", error: err.message });
  }
};

// GET /api/orders → get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
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
