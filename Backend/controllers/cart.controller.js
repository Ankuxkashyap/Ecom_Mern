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
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        
            const cart = await Cart.findOne({ userId });
            if (!cart) return res.status(404).json({ message: "Cart not found" });

            cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
            );

            await cart.save();

            res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const  userId  = req.user._id;
        const { productId } = req.params.productId;
        const  quantity  = req.body;


    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    console.log(item);

    if (!item) return res.status(404).json({ message: "Product not in cart" });

    if (quantity > 0) {
      item.quantity = quantity;
    } else {
      // If quantity is 0, remove item from cart
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    await cart.save();
    res.status(200).json(cart);

    } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );

        await cart.save();
        res.status(200).json({ message:"Cart delete ", cart});

    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: "Server error" });
    }
}
