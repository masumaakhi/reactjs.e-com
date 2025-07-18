import { useState, useEffect, useRef, useCallback  } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const ProductSlider = () => {
    const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [imgKey, setImgKey] = useState(0);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const { dispatch } = useCart();
  const auth = getAuth();

    // 1️⃣ Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProducts();
  }, []);
  const product = products[index] || {};


    const startAutoSlide = useCallback(() => {
  intervalRef.current = setInterval(() => {
    setIndex((prev) => (prev + 1) % products.length);
  }, 2000);
}, [setIndex]);

const stopAutoSlide = useCallback(() => {
  clearInterval(intervalRef.current);
}, []);

  useEffect(() => {
    if (!isHovered) {
      startAutoSlide();
    }

    return () => stopAutoSlide(); // Cleanup when unmount or hover change
  }, [isHovered, startAutoSlide, stopAutoSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [setIndex]);

  // Re-trigger animation
  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timeout);
  }, [index]);
  // This ensures animation triggers on each change
  useEffect(() => {
    setImgKey(index); // triggers re-render of img with new key
  }, [index]);


  const addToCartHandler = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image?.[0],
      },
    });
    toast.success("Item added to cart!");
  };

  const handleAddToCart = () => {
    const user = auth.currentUser;

    if (!user) {
      toast.warning("Please sign in to add items to your cart.");
      navigate("/signin");
      return;
    }

    addToCartHandler();
  };
  const handleBuyNow = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.warning("Please sign in to continue checkout.");
      navigate("/signin");
      return;
    }

    navigate("/checkout", { state: { product, fromBuyNow: true } });
  };


  const next = () => setIndex((index + 1) % products.length);
  const prev = () => setIndex((index - 1 + products.length) % products.length);

  return (
    <div className="text-white text-center max-w-full mx-auto w-full py-12 relative">
      <button
        onClick={prev}
        className="absolute left-0 text-6xl px-3 hover:text-gray-300 transition z-10"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        &larr;
      </button>

      <div>
        <img
          key={`${product.id}-${imgKey}`}
          src={product.image?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="imageshow mx-auto w-[500px] h-[600px] object-contain mb-6"
        />
      </div>

      <button
        onClick={next}
        className="absolute right-0 text-6xl px-3 hover:text-gray-300 transition z-10"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        &rarr;
      </button>

      <h2
        key={`title-${imgKey}`} // 🔁 re-render with each change
        className="product-name-animate absolute bottom-[25rem] left-1/2 transform -translate-x-1/2 text-6xl font-bold text-white px-6 py-3 rounded-xl backdrop-blur-sm bg-gradient-to-r from-indigo-500 via-purple-200 to-pink-900 bg-clip-text text-transparent"
      >
        {product.name}
      </h2>

      <div
        key={`details-${imgKey}`}
        className="animate-slide-up md:max-w-full md:flex md:justify-evenly md:items-start md:mt-[-11rem] md:px-6"
      >
        <div className="md:mr-[25rem]">
          <h3 className="text-5xl mt-4">${product.price}</h3>
          <p className="text-2xl text-gray-300 md:max-w-[35rem] md:mt-6">
            {product.description || "No description available."}
          </p>
        </div>
        <div
          className="flex justify-center items-center md:mt-[6rem] gap-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={handleBuyNow}
            className="mt-6 px-8 py-2 text-xl bg-white text-black rounded-full hover:bg-gray-200 transition"
          >
            Buy Now
          </button>

          <button
            onClick={handleAddToCart}
            className="mt-6 px-8 py-2 text-xl bg-white text-black rounded-full hover:bg-gray-200 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;