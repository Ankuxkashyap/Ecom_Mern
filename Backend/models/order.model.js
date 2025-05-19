import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    address: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Credit Card", "PayPal", "Cash on Delivery"],
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },

}, { timestamps: true });
const Order = mongoose.model("Order", orderSchema);
export default Order;
