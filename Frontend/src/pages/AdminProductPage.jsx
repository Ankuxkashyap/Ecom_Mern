import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { Navbar } from "../components/Navbar";
import toast from "react-hot-toast";

export default function AdminProductPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", image: "" , discount: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isAdmin) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/products", {
        withCredentials: true,
      });
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async () => {
    try {
      const endpoint = editId
        ? `http://localhost:3000/products/${editId}`
        : "http://localhost:3000/products";
      const method = editId ? "put" : "post";

      const res = await axios[method](
        endpoint,
        form,
        { withCredentials: true }
      );

      toast.success(`Product ${editId ? "updated" : "created"} successfully`);
      setForm({ name: "", price: "", description: "", image: "" });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      discount:product.discount,
      category: product.category,
    });
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`, {
        withCredentials: true,
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (!user?.isAdmin) {
    return <p className="text-center text-red-500 mt-10">Access Denied. Admins only.</p>;
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-90px)]">
        {/* Sidebar */}
        <aside className="w-[250px] bg-white shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
          <p className="text-gray-500">{user?.email}</p>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-90px)]">
          <h3 className="text-2xl font-semibold mb-4">Manage Products</h3>

          {/* Form */}
          <div className="bg-white p-4 shadow rounded-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleInputChange}
                className="border p-2 rounded col-span-2"
              />
              <input
                type="text"
                name="description"
                placeholder="Category"
                value={form.category}
                onChange={handleInputChange}
                className="border p-2 rounded col-span-2"
              />
              <input
                type="text"
                name="image"
                placeholder="Image Path"
                value={form.image}
                onChange={handleInputChange}
                className="border p-2 rounded col-span-2"
              />
              <button
                onClick={handleCreateOrUpdate}
                className="bg-black text-white py-2 rounded col-span-2 hover:bg-gray-700"
              >
                {editId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>

          {/* Product List */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-100 p-4 rounded shadow-sm">
                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2 rounded"
                  />
                  <h4 className="text-xl font-bold">{product.name}</h4>
                  <p className="text-gray-700 mb-1">₹ {product.price}</p>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
