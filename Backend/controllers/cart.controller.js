import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
            );

            if (existingItem) {
            existingItem.quantity += quantity;
            } else {
            cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        res.status(200).json(cart);
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getCart = async (req, res) => {
    try {

        const  userId = req.user._id;

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.status(200).json(cart);

    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateCartItem = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;
  const  {quantity}  = req.body;
  // console.log(quantity);

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      // Optional: remove item if quantity is 0
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
