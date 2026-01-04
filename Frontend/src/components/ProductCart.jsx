import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { user } = useAuthStore((state) => state);
  const { getCartItems } = useCartStore((state) => state);

  // console.log("ProductCard", product);
  // console.log("User in ProductCard", user);
  // console.log(user.id)
  const addToCart = async (productId,e) => {
      e.stopPropagation();
    if (!user || !user.id) {
      toast.error("Please login to add items to cart.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/cart",
        {
          productId,
          quantity: 1,
        },
        { withCredentials: true }
      );
      console.log("Add to cart response:", response);
      if (response.status === 200) {
        toast.success("Product added to cart!");
        getCartItems();
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    onClick={() => navigate(`/product/${product._id}`)}
     className= "bg-gray-200 shadow-sm rounded-xl p-4 w-full hover:shadow-xl transition">
      <img
        src={`${product.image}`}
        alt={product.name}
        className="w-full h-60 object-contain rounded-md mb-3 bg-gray-100"
      />
      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex flex-col">
          <h3 className="font-medium text-xl sm:text-lg leading-tight">
            {product.name}
          </h3>
          <h5 className="font-base sm:text-lg text-slate-800 leading-tight">
            {product.description}
          </h5>
          <div className="text-lg font-bold text-gray-700 mt-1">
            {product.price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
            {product.discount && product.discount > 0 && (
              <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                {product.discount}%
              </span>
            )}
          </div>
        </div>
        <button
          className={`${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600 hover:text-black"
          } bg-black text-white w-9 h-9 rounded-full text-xl font-bold flex items-center justify-center`}
          onClick={() => addToCart(product._id)}
          disabled={loading}
        >
          +
        </button>
      </div>
    </div>
  );
};
