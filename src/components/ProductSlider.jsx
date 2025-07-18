// import { useState, useEffect, useRef } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import { useNavigate, useOutletContext } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { getAuth } from "firebase/auth";
// import { toast } from "react-toastify";

// const ProductSlider = () => {
//   const [products, setProducts] = useState([]);
 // // const [index, setIndex] = useState(0);
//   const [imgKey, setImgKey] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const navigate = useNavigate();
//   const { dispatch } = useCart();
//   const auth = getAuth();
//  const { index, setIndex, product, setProduct, imgRef } = useOutletContext();

//   // 1️⃣ Fetch all products once
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const snap = await getDocs(collection(db, "products"));
//         setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const product = products[index] || {};

//   // 2️⃣ Simplified auto-slide
//   useEffect(() => {
//     if (products.length <= 1 || isHovered) return;

//     const intervalId = setInterval(() => {
//       setIndex((prev) => (prev + 1) % products.length);
//     }, 2000);

//     return () => clearInterval(intervalId);
//   }, [products.length, isHovered]);

//   // 3️⃣ Bump key to retrigger CSS animations on index change
//   useEffect(() => {
//     setImgKey((prev) => prev + 1);
//   }, [index]);

//   // Handlers
//   const addToCartHandler = () => {
//     dispatch({
//       type: "ADD_TO_CART",
//       payload: {
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.image?.[0],
//       },
//     });
//     toast.success("Item added to cart!");
//   };

//   const handleAddToCart = () => {
//     if (!auth.currentUser) {
//       toast.warning("Sign in first");
//       navigate("/signin");
//       return;
//     }
//     addToCartHandler();
//   };

//   const handleBuyNow = () => {
//     if (!auth.currentUser) {
//       toast.warning("Sign in first");
//       navigate("/signin");
//       return;
//     }
//     navigate("/checkout", { state: { product, fromBuyNow: true } });
//   };

//   return (
//     <div className="text-white text-center max-w-full mx-auto w-full py-12 relative">
//       {/* PREV / NEXT if you still want arrows */}
//       <button
//         onClick={() =>
//           setIndex((i) => (i - 1 + products.length) % products.length)
//         }
//         className="absolute left-0 top-1/2 text-6xl px-3 z-10"
//         style={{ top: "50%", transform: "translateY(-50%)" }}
//       >
//         &larr;
//       </button>

     

//       {/* IMAGE */}
//       {product.id && (
//         <img
//           key={`${product.id}-${imgKey}`}
//           ref={imgRef}
//           src={product.image?.[0] || "/placeholder.jpg"}
//           alt={product.name}
//           crossOrigin="anonymous"
//           className="imageshow mx-auto w-[500px] h-[600px] object-contain mb-6"
//           style={{ opacity: 1 }}

//         />
//       )}
//        <button
//         onClick={() => setIndex((i) => (i + 1) % products.length)}
//         className="absolute right-0 text-6xl px-3 hover:text-gray-300 transition z-10"
//         style={{ top: "50%", transform: "translateY(-50%)" }}
//       >
//         &rarr;
//       </button>

//       {/* TITLE */}
//       <h2
//         key={`title-${imgKey}`}
//         className="product-name-animate absolute bottom-[35rem] md:bottom-[30rem] lg:bottom-[25rem] left-1/2 transform -translate-x-1/2 text-4xl md:text-6xl font-bold text-white px-6 py-3 rounded-xl  bg-gradient-to-r from-indigo-500 via-purple-200 to-pink-900 bg-clip-text text-transparent"
//       >
//         {product.name}
//       </h2>

//       {/* PRICE & DESC */}
//       <div key={`details-${imgKey}`}
//         className="animate-slide-up md:align-center lg:max-w-full lg:flex lg:justify-evenly px-5 lg:items-start lg:mt-[-11rem] lg:px-6"
//         >
//         <div className="lg:mr-[18rem]">
//           <h3 className="text-5xl mt-4">${product.price}</h3>
//           <p className="text-2xl text-gray-300 py-4 lg:py-0 lg:max-w-[32rem] lg:mt-6">
//             {product.description
//     ? (() => {
//         const w = product.description.split(" ");
//         return w.slice(0, 14).join(" ") + (w.length > 14 ? "…" : "");
//       })()
//     : "No description available"}
//           </p>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-center items-center lg:mt-[3rem] gap-6"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <button
//             onClick={handleBuyNow}
//             className="mt-6 px-8 py-2 text-xl bg-white text-black rounded-full hover:bg-gray-200 transition"
//           >
//             Buy Now
//           </button>
//           <button
//             onClick={handleAddToCart}
//             className="mt-6 px-8 py-2 text-xl bg-white text-black rounded-full hover:bg-gray-200 transition"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductSlider;


import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [imgKey, setImgKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const auth = getAuth();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 🟩 Accessing context from App.js
  const { index, setIndex, product, setProduct, imgRef } = useOutletContext();

  useEffect(() => {
  setIsImageLoaded(false); // image লোড হওয়ার আগে reset
}, [index]);

  // 🟢 Fetch product data from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        const fetched = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetched);
        if (fetched.length > 0) {
          setProduct(fetched[index]); // set initial product to App.js
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProducts();
  }, []);

  // 🔁 Update App.js product whenever index changes
  useEffect(() => {
    if (products.length > 0) {
      setProduct(products[index]);
    }
  }, [index, products, setProduct]);

  // 🔁 Auto slide unless hovered
  useEffect(() => {
    if (products.length <= 1 || isHovered) return;
    const intervalId = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [products.length, isHovered]);

  // 🔄 Force animation on image change
  useEffect(() => {
    setImgKey((prev) => prev + 1);
  }, [index]);

  const handleAddToCart = () => {
    if (!auth.currentUser) {
      toast.warning("Sign in first");
      navigate("/signin");
      return;
    }
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

  const handleBuyNow = () => {
  if (!auth.currentUser) {
    toast.warning("Sign in first");
    navigate("/signin");
    return;
  }

  // 🟩 Push Buy Now product to cart (with quantity: 1)
  dispatch({
    type: "ADD_TO_CART",
    payload: {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image?.[0],
      quantity: 1,
    },
  });

  // 🟩 Then go to checkout (but without fromBuyNow)
  navigate("/checkout");
};

  return (
    <div className="text-white text-center max-w-full mx-auto w-full py-12 relative">
      <button
        onClick={() =>
          setIndex((i) => (i - 1 + products.length) % products.length)
        }
        className="absolute left-0 top-1/2 text-6xl px-3 z-10"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        &larr;
      </button>

      {/* IMAGE with ref */}
      {product?.id && (
        <img
          key={`${product.id}-${imgKey}`}
          ref={imgRef}
          src={product.image?.[0] || "/placeholder.jpg"}
          alt={product.name}
          crossOrigin="anonymous"
           onLoad={() => setIsImageLoaded(true)} 
          className="imageshow mx-auto w-[500px] h-[600px] object-contain mb-6"
        />
      )}

      <button
        onClick={() => setIndex((i) => (i + 1) % products.length)}
        className="absolute right-0 text-6xl px-3 hover:text-gray-300 transition z-10"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        &rarr;
      </button>

      {/* TITLE */}
      <h2
        key={`title-${imgKey}`}
        className="product-name-animate absolute bottom-[35rem] md:bottom-[30rem] lg:bottom-[25rem] left-1/2 transform -translate-x-1/2 text-3xl md:text-4xl lg:text-6xl font-bold text-white px-6 py-3 rounded-xl  bg-gradient-to-r from-indigo-500 via-purple-200 to-pink-900 bg-clip-text text-transparent"
      >
        {product.name}
      </h2>

      {/* PRICE + DESCRIPTION + BUTTONS */}
      <div
        key={`details-${imgKey}`}
        className={`${
    isImageLoaded ? "animate-slide-up" : ""
  } md:align-center lg:max-w-full lg:flex lg:justify-evenly px-5 lg:items-start lg:mt-[-11rem] lg:px-6`}
      >
        <div className="lg:mr-[14rem] xl:mr-[18rem]">
          <h3 className="text-4xl md:text-5xl mt-4">${product.price}</h3>
          <p className="text-xl md:text-2xl text-gray-300 py-4 lg:py-0 lg:max-w-[28rem] xl:max-w-[32rem] lg:mt-6">
            {product.description
              ? (() => {
                  const words = product.description.split(" ");
                  return words.slice(0, 14).join(" ") + (words.length > 14 ? "…" : "");
                })()
              : "No description available"}
          </p>
        </div>

        <div
          className="flex justify-center items-center lg:mt-[3rem] gap-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
<button
  onClick={handleBuyNow}
  className="mt-6 px-4 sm:px-6 xl:px-8 py-2 text-base md:text-lg xl:text-xl bg-white text-black rounded-full hover:bg-gray-200 transition"
>
  Buy Now
</button>

<button
  onClick={handleAddToCart}
  className="mt-6 px-4 sm:px-6 xl:px-8 py-2 text-base md:text-lg xl:text-xl bg-white text-black rounded-full hover:bg-gray-200 transition"
>
  Add to Cart
</button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
