import React, { useState, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    category: "",
    brand: "",
    productType: "Featured",
    description: "",
    aboutItem: "",
    availableColors: "",
  });

  const [image, setImage] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage([...e.target.files]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Upload images to Cloudinary first
    const imageUrls = await Promise.all(
      image.map(async (image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "imageecom"); // set from Cloudinary dashboard
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/drlo4ktpa/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
    console.log("Cloudinary response:", data); // 👈 Add this

    if (!response.ok) {
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    return data.secure_url;
      })
    );

    // Now store in Firestore with image URLs
    await addDoc(collection(db, "products"), {
      ...formData,
      image: imageUrls,
      createdAt: new Date(),
    });

    alert("✅ Product added successfully!");
    setFormData({
      name: "",
      price: "",
      discount: "",
      category: "",
      brand: "",
      productType: "Featured",
      description: "",
      aboutItem: "",
      availableColors: "",
    });
    setImage([]);
    fileInputRef.current.value = null;
  } catch (error) {
    console.error("Error uploading product:", error);
    alert("❌ Error uploading product. See console for details.");
  }
};

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-slate-800 text-white rounded-md shadow-md">
              <nav className="text-gray-400 text-sm mb-6 flex space-x-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>{">"}</span>
        <Link to="/products" className="hover:text-white">products</Link>
        <span>{">"}</span>
        <span className="text-white font-semibold">add product</span>
      </nav>
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">Product Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input name="price" value={formData.price} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">Discount</label>
          <input name="discount" value={formData.discount} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <input name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">Brand</label>
          <input name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">Product Type</label>
          <select name="productType" value={formData.productType} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded">
            <option>Featured</option>
            <option>Popular</option>
            <option>New</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full h-24 p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">Available Colors</label>
          <input name="availableColors" value={formData.availableColors} onChange={handleChange} className="w-full p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">About Item</label>
          <textarea name="aboutItem" value={formData.aboutItem} onChange={handleChange} className="w-full h-24 p-2 bg-slate-900 border border-slate-700 rounded" />
        </div>
        <div>
          <label className="block mb-1">Product Images</label>
          <p className="text-sm text-gray-400 mb-1">You can upload multiple images for this product.</p>
          <input type="file" multiple onChange={handleImageChange}  ref={fileInputRef} className="w-full p-2 bg-slate-900 border border-slate-700 text-white rounded" />
        </div>
        <div>
          <button type="submit" className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300 transition">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;