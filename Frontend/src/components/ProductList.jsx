import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from './Navbar';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/product');
      console.log(res)
      setProducts(res.data.products);
      console.log(products)
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/product/${productId}`, {
        withCredentials: true,
      });
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      toast.error('Failed to delete product');
      console.error(err);
    }
  };

  const handleEdit = (productId) => {
    navigate('/add-product', { state: { product: products.find(p => p._id === productId) } });
    toast.success('Edit product clicked');
  };


  if (loading) return <p className="p-4">Loading products...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-200 shadow-sm rounded-xl p-4 w-full hover:shadow-xl transition"
          >
            <img
              src={`${product.image}`}
              alt={product.name}
              className="w-full h-60 object-cover bg-red-700 rounded-md mb-3"
            />
            <div className="flex flex-col mb-2">
              <h3 className="font-medium text-xl sm:text-lg leading-tight">
                {product.name}
              </h3>
              <p className="text-sm text-gray-700">{product.description}</p>
              <div className="text-lg font-bold text-gray-700 mt-1">
                ₹ {product.price}
                {product.discount && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                    {product.discount}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 gap-2">
              

              {user?.isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-600 hover:text-white text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
