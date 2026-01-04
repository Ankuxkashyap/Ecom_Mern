import React, { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = ({ setProducts, setLoading }) => {
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Hardcoded categories
    setCategories([
      { _id: "1", name: "Electronics" },
      { _id: "2", name: "Clothing" },
      { _id: "3", name: "Books" },
    ]);
  }, []);

  useEffect(() => {
    handleFilter(filter);
  }, [filter]);

  useEffect(() => {
    handleCategory(category);
  }, [category]);

  const handleCategory = async (cat) => {
    setLoading(true);
    try {
      if (cat === "all") {
        const res = await axios.get("http://localhost:3000/product");
        setProducts(res.data.products || res.data);
      } else {
        const res = await axios.get(
          `http://localhost:3000/product/category/${cat}`
        );
        setProducts(res.data.products || res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (type) => {
    setLoading(true);
    try {
      let url = "";
      if (type === "new") url = "http://localhost:3000/product/new-collection";
      else if (type === "discount")
        url = "http://localhost:3000/product/discounted-products";
      else {
        const res = await axios.get("http://localhost:3000/product");
        setProducts(res.data.products || res.data);
        return;
      }

      const res = await axios.get(url);
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/4 p-4 bg-white shadow-sm overflow-y-auto">
      <h2 className="font-semibold mb-2">Filter by Category:</h2>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 border px-2 py-1 rounded"
      >
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c.name.toLowerCase()}>
            {c.name}
          </option>
        ))}
      </select>

      <h2 className="font-semibold mb-2">Filter by:</h2>
      <div className="space-y-2">
        <label>
          <input
            type="radio"
            name="filter"
            value="all"
            checked={filter === "all"}
            onChange={(e) => setFilter(e.target.value)}
            className="mr-2"
          />
          All
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="filter"
            value="new"
            checked={filter === "new"}
            onChange={(e) => setFilter(e.target.value)}
            className="mr-2"
          />
          New Collection
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="filter"
            value="discount"
            checked={filter === "discount"}
            onChange={(e) => setFilter(e.target.value)}
            className="mr-2"
          />
          Discounted
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
