// ProductDashboard.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MoreVertical } from "lucide-react";

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
   const menuRef = useRef();
   const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = (product) => {
    navigate(`/update/${product.id}`);
  };

 const handleView = (product) => {
  navigate(`/products/${product.id}`); // ✅ product id দিয়ে Navigate
};

  return (
    <div className=" min-h-screen p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link to="/addproduct">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            New Product
          </button>
          </Link>
        </div>
        <table className="w-full bg-gray-900 rounded-xl">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-3">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-700">
                <td className="p-3">
                  <img
  src={product.image?.[0] || "/placeholder.png"}
  alt={product.name}
  className="w-10 h-10 object-cover rounded"
/>
                </td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === product.id ? null : product.id
                      )
                    }
                    className="p-2 rounded hover:bg-gray-700"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {dropdownOpen === product.id && (
                    <div
                    ref={menuRef}
                     className="absolute z-10 right-[2rem] mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg py-2">
                      <button
                        onClick={() => handleView(product)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-800"
                      >
                        View Product
                      </button>
                      <button
                        onClick={() => handleUpdate(product)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-800"
                      >
                        Update Product
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-800 text-red-600"
                      >
                        Delete Product
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Product Modal View */}
        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {selectedProduct.name}
              </h2>
              <img
                src={selectedProduct.images?.[0] || "/placeholder.png"}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded"
              />
              <p className="mt-2">
                <strong>Price:</strong> ${selectedProduct.price}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
