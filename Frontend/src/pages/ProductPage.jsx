import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Navbar } from "../components/Navbar";
import {useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { user } = useAuthStore((state) => state);

    const { getCartItems } = useCartStore((state) => state);
    const [loading, setLoading] = useState(false);
    const addToCart = async (productId) => {
        
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const productRes = await axios.get(
          `http://localhost:3000/product/${id}`
        );
        setProduct(productRes.data.product || productRes.data);

        // Fetch similar products
        const similarRes = await axios.get(
          `http://localhost:3000/product/similar/${id}`
        );
        setSimilarProducts(
          Array.isArray(similarRes.data)
            ? similarRes.data
            : similarRes.data.similarProducts || []
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 overflow-x-auto py-10">
        {product ? (
          <div className="bg-white rounded-2xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-md h-[200px] md:h-[420px]  object-contain"
              />
            </div>

            <div className="flex flex-col h-full">
              <h1 className="text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>

              <p className="text-gray-600 mt-4 leading-relaxed mb-4">
                {product.description}
              </p>

              <div className="flex-1" />

              <div className="border-t pt-6 flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ₹ {product.price}
                </span>

                <button
                  onClick={(e) => addToCart(product._id)}
                  className="bg-black text-white px-8 py-3 rounded-xl cursor-pointer
                             hover:bg-gray-800 transition font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading product...</p>
        )}

        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl text-start font-semibold text-gray-900 mb-6">
              Similar Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {similarProducts.map((item) => (
                <Link
                  to={`/product/${item._id}`}
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm p-4
                     hover:shadow-lg transition"
                >
                  <div className="bg-gray-50 rounded-lg p-3 flex justify-center">
                    <img
                      loading="lazy"
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full object-contain"
                    />
                  </div>

                  <h3 className="mt-3 text-sm font-medium text-gray-800 line-clamp-1">
                    {item.name}
                  </h3>

                  <p className="mt-1 font-semibold text-gray-900">
                    ₹ {item.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPage;
