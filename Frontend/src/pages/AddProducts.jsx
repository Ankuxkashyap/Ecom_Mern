import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "../components/Navbar";

export default function AddProducts() {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const editingProduct = location.state?.product || null;

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    if (editingProduct) {
      setProduct({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        discount: editingProduct.discount || "",
        category: editingProduct.category || "",
        image: null,
      });
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProduct((prev) => ({ ...prev, image: files[0] }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:3000/product/${editingProduct._id}`,
          form,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Product updated successfully");
        navigate("/");
      } else {
        await axios.post("http://localhost:3000/product", form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully");
      }
      navigate("/products");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-gray-100 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg p-6 rounded-xl w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
          {editingProduct ? "Update Product" : "Add Product"}
          </h2>

          <input
            name="name"
            type="text"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-2 border border-gray-300 rounded"
          />

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            name="discount"
            type="number"
            value={product.discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="newCollection"
            placeholder="newCollection"
            value={product.newCollection || ""}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={product.category}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />

          <input
            name="image"
            type="file"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
}
