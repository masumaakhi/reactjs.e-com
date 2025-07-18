import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ViewProductPage = () => {
  const { id } = useParams(); // ✅ URL থেকে ID নিচ্ছে
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "products", id);
      const snapshot = await getDoc(productRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setProduct(data);
        setSelectedImage(data.image?.[0] || "/placeholder.png");
      }
    };
    fetchProduct();
  }, [id]);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!product) {
    return <p className="text-center text-white mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-800 text-white rounded-md shadow-md">
      {/* ✅ Breadcrumb */}
      <nav className="text-gray-400 text-sm mb-6 flex space-x-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>{">"}</span>
        <Link to="/products" className="hover:text-white">products</Link>
        <span>{">"}</span>
        <span className="text-white font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Left Side: Image + Thumbnails */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg bg-slate-900 p-4"
          />
          <div className="flex space-x-4 mt-4">
            {product.image?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumbnail"
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  selectedImage === img ? "border-blue-500" : "border-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ✅ Right Side: Details */}
        <div>
          <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm">
            {product.category}
          </span>
          <h1 className="text-2xl font-bold mt-3">{product.name}</h1>
          <p className="text-gray-400 mt-2 text-sm">{product.description}</p>
          <p className="mt-3 text-sm">
            <span className="text-gray-400">Only</span>{" "}
            <span className="text-red-400 font-bold">{product.stock || 5}</span>{" "}
            items in stock
          </p>

          {/* ✅ Colors */}
          <div className="mt-3">
            <p className="mb-1 text-gray-400">Colors</p>
            <div className="flex space-x-2">
              {product.availableColors?.split(",").map((color, index) => (
                <span
                  key={index}
                  className="w-6 h-6 rounded-full cursor-pointer border"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          </div>

          {/* ✅ Price */}
          <div className="mt-4 flex items-center space-x-4">
            {product.discount && (
              <p className="text-gray-400 line-through">${product.price}</p>
            )}
            <p className="text-green-400 text-2xl font-bold">
              ${product.discount || product.price}
            </p>
          </div>

          {/* ✅ Quantity & Buttons */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center border border-gray-500 rounded">
              <button onClick={decreaseQty} className="px-3 py-1">-</button>
              <span className="px-4">{quantity}</span>
              <button onClick={increaseQty} className="px-3 py-1">+</button>
            </div>
            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-300">
              Add To Cart
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Tabs Section */}
      <div className="mt-8 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-bold mb-2">About This Item</h3>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          {product.aboutItem?.split(".").map((item, index) => (
            item.trim() && <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewProductPage;
