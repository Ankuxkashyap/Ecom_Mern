import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        // enum: ["credit card", "stripe", "cash on delivery"]
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Shipped", "Delivered", "Canceled"],
        default: "Pending",
    },
    totalPrice: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
