import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
     name:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required :true,
        default: 0,
    },
    description:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    }, 
    dicount:{
        type: Number,
        default: 0,
    },
    newCollection:{
        type: Boolean,
        default: false,
    },
    dicounted:{
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;