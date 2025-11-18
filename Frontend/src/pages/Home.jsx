import { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCart";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/product");
      const data = Array.isArray(res.data) ? res.data : res.data.products;
      setProducts(data);
    } catch (err) {
      console.error("Error fetching all products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const hardcodedCategories = [
      { _id: "1", name: "Electronics" },
      { _id: "2", name: "Clothing" },
      { _id: "3", name: "Books" },
    ];
    setCategories(hardcodedCategories);
  };

  const fetchProductsByCategory = async (category) => {
    // console.log("Fetching products for category:", category.toupperCase());
    setLoading(true);
    try {
      if (category === "all") {
        fetchAllProducts();
      } else {
        const res = await axios.get(`http://localhost:3000/product/category/${category}`);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || res.data.product;
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching category products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredProducts = async (filterType) => {
    setLoading(true);
    try {
      if (filterType === "all") {
        fetchAllProducts();
      } else {
        let url = "";
        if (filterType === "new") {
          url = "http://localhost:3000/product/new-collection";
        } else if (filterType === "discount") {
          url = "http://localhost:3000/product/discounted-products";
        }

        const res = await axios.get(url);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || res.data.product;
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching filtered products:", err);
    } finally {
      setLoading(false);
    }
  };

  const Sidebar = () => {
    const handleCategoryChange = (e) => {
      const category = e.target.value;
      setSelectedCategory(category);
      fetchProductsByCategory(category);
      setShowSidebar(false);
    };

    const handleFilterChange = (e) => {
      const filter = e.target.value;
      setSelectedFilter(filter);
      fetchFilteredProducts(filter);
      setShowSidebar(false);
    };

    return (
      <div className="w-full bg-white p-4 rounded-md shadow-sm h-[100vh] md:h-auto">
        <div className="mb-6">
          <label htmlFor="category" className="block font-medium text-gray-800 mb-2">
            Filter by Category:
          </label>
          <select
            id="category"
            name="category"
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">All</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name.toLowerCase()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-md font-semibold text-gray-800 mb-3">Filter by:</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="new-collection"
                name="filter"
                value="new"
                checked={selectedFilter === "new"}
                className="mr-2 text-blue-600"
                onChange={handleFilterChange}
              />
              <label htmlFor="new-collection" className="text-gray-700 cursor-pointer">
                New Collection
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="all-products"
                name="filter"
                value="all"
                checked={selectedFilter === "all"}
                className="mr-2 text-blue-600"
                onChange={handleFilterChange}
              />
              <label htmlFor="all-products" className="text-gray-700 cursor-pointer">
                All Products
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="discounted"
                name="filter"
                value="discount"
                checked={selectedFilter === "discount"}
                className="mr-2 text-blue-600"
                onChange={handleFilterChange}
              />
              <label htmlFor="discounted" className="text-gray-700 cursor-pointer">
                Discounted Products
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Navbar />

      {/* Sidebar toggle for mobile */}
      <div className="flex items-center md:hidden p-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-lg font-medium flex items-center gap-2"
        >
          <Menu className="w-6 h-6" /> Categories
        </button>
      </div>

      <div className="flex flex-col md:flex-row relative">
        {/* Mobile Sidebar */}
        {showSidebar && (
          <div className="absolute z-20 max-w-[90vw] w-3/4 sm:w-2/5 h-full bg-white shadow-lg md:hidden">
            <Sidebar />
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-1/5">
          <Sidebar />
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-4/5 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              <p className="text-center col-span-full text-lg">Loading...</p>
            ) : (
              Array.isArray(products) &&
              products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
