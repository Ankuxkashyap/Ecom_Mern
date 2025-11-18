import exp from "constants";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";
import fs from "fs";

 export const createProduct = async (req, res) => {
     try {
    const { name, price, category ,description ,discount} = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecommerce-products',
    });

 
    fs.unlinkSync(req.file.path);

    const newProduct = new Product({
      name,
      price,
      category,
      image: result.secure_url,
      description, 
      discount,
      newCollection: req.body.newCollection || false,
      discounted: req.body.discounted || false,
    });

    await newProduct.save();

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
    console.error(err);
  }
}
export const updateProduct = async (req, res) => {
  try {
        const { name, price, category, description ,discount,newCollection,discounted} = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let imageUrl = product.image;

        if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'ecommerce-products',
        });

        fs.unlinkSync(req.file.path);
            imageUrl = result.secure_url;
        }

        product.name = name || product.name;            
        product.price = price || product.price;
        product.category = category || product.category;
        product.description = description || product.description;
        product.discount = discount || product.discount;
        product.image = imageUrl;
        product.newCollection = req.body.newCollection || product.newCollection;
        product.discounted = req.body.discounted || product.discounted;

        await product.save();

        res.status(200).json({ success: true, product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
    
        const product = await Product.find
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.find(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}
export const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;

        const products = await Product.find({ category });
        res.status(200).json({ success: true, products });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}

export const searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json({ success: true, products });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}
export const getNewCollectionProducts = async (req, res) => {
    try {
        const products = await Product.find({ newCollection: true });
        res.status(200).json({ success: true, products });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}

export const getProductsByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        res.status(200).json({ success: true, products });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.error(err);
    }
}   

export const getProductsDiscounted = async (req, res) => {
  try {
    const products = await Product.find({ discount: { $gt: 0 } }); // only products with discount > 0
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching discounted products:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
