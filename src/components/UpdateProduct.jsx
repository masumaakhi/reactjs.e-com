import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  // ✅ Load Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "products", id);
      const snapshot = await getDoc(productRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFormData({
          name: data.name || "",
          price: data.price || "",
          discount: data.discount || "",
          category: data.category || "",
          brand: data.brand || "",
          productType: data.productType || "Featured",
          description: data.description || "",
          aboutItem: data.aboutItem || "",
          availableColors: data.availableColors || "",
        });
        setImage(data.image || []);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

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

  // ✅ Update Logic
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productRef = doc(db, "products", id);

      let updatedImageUrls = image;

      // ✅ যদি নতুন Image Upload হয়
      if (image.length && typeof image[0] !== "string") {
        updatedImageUrls = await Promise.all(
          image.map(async (img) => {
            const formData = new FormData();
            formData.append("file", img);
            formData.append("upload_preset", "imageecom"); // Cloudinary preset

            const res = await fetch(
              `https://api.cloudinary.com/v1_1/drlo4ktpa/image/upload`,
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await res.json();
            return data.secure_url;
          })
        );
      }

      await updateDoc(productRef, {
        ...formData,
        image: updatedImageUrls,
        updatedAt: new Date(),
      });

      alert("✅ Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update product!");
    }
  };

  if (loading) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-slate-800 text-white rounded-md shadow-md">
      {/* ✅ Breadcrumb */}
      <nav className="text-gray-400 text-sm mb-6 flex space-x-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>{">"}</span>
        <Link to="/products" className="hover:text-white">Products</Link>
        <span>{">"}</span>
        <span className="text-white font-semibold">Update Product</span>
      </nav>

      <h2 className="text-2xl font-semibold mb-6">Update Product</h2>
      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Inputs */}
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

        {/* ✅ Image Upload */}
        <div>
          <label className="block mb-1">Product Images</label>
          <p className="text-sm text-gray-400 mb-1">Upload new images or keep existing ones.</p>
          <input type="file" multiple onChange={handleImageChange} ref={fileInputRef} className="w-full p-2 bg-slate-900 border border-slate-700 text-white rounded" />
          <div className="flex gap-2 mt-2">
            {image.length > 0 && image.map((img, idx) => (
              <img key={idx} src={typeof img === "string" ? img : URL.createObjectURL(img)} alt="preview" className="w-16 h-16 rounded object-cover" />
            ))}
          </div>
        </div>

        {/* ✅ Submit */}
        <div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
