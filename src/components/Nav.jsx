// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { HiMenu, HiX, HiOutlineUserCircle } from "react-icons/hi";
// import { HiOutlineShoppingCart } from "react-icons/hi2";
// import { RiLayoutMasonryFill } from "react-icons/ri";
// import { useCart } from "../context/CartContext";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase"; // 🔴 make sure db is exported from firebase config

// const Nav = () => {
//   const location = useLocation();
//   const { cartItems } = useCart();
//   const [badgeShownOnce, setBadgeShownOnce] = useState(false);
//   const [user, setUser] = useState(null); // firebase user
//   const [userData, setUserData] = useState(null); // firestore user info
//   const auth = getAuth();

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);

//       if (currentUser) {
//         const userRef = doc(db, "users", currentUser.uid);
//         const userSnap = await getDoc(userRef);
//         if (userSnap.exists()) {
//           setUserData(userSnap.data()); // role, name, etc.
//         }
//       } else {
//         setUserData(null);
//       }
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   useEffect(() => {
//     if (location.pathname === "/cart" && cartItems.length > 0) {
//       setBadgeShownOnce(true);
//     }
//   }, [location.pathname, cartItems]);

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   const logout = async () => {
//     await signOut(auth);
//     setDropdownOpen(false);
//     setMenuOpen(false);
//   };

//   return (
//     <nav className="bg-transparent text-white border-b px-4 py-3 shadow">
//       <div className="max-w-7xl mx-auto my-2 flex justify-between items-center">
//         {/* Left: Logo + Links */}
//         <div className="flex items-center space-x-8">
//           <Link to="/" className="text-2xl font-bold">
//             <RiLayoutMasonryFill size={28} />
//           </Link>
//           <div className="hidden md:flex space-x-6 text-lg">
//             <Link to="/">Home</Link>
//             <Link to="/shop">Shop</Link>
//           </div>
//         </div>

//         {/* Right */}
//         <div className="hidden md:flex items-center space-x-6 text-lg">
//           <Link to="/cart" className="relative">
//             {!badgeShownOnce && totalQuantity > 0 && (
//               <span className="absolute top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                 {totalQuantity}
//               </span>
//             )}
//             <HiOutlineShoppingCart size={28} />
//           </Link>

//           {!user ? (
//             <>
//               <Link to="/signin">Signin</Link>
//               <Link to="/signup">Signup</Link>
//             </>
//           ) : (
//             <div className="relative">
//               <button
//                 onClick={toggleDropdown}
//                 className="px-3 py-2 rounded font-semibold"
//               >
//                 <HiOutlineUserCircle size={28} />
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-60 bg-white text-blue-800 rounded shadow-md z-50 flex flex-col">
//                   {userData?.role === "admin" ? (
//                     <>
//                       <Link to="/dashboard" className="w-full text-left px-4 py-2 hover:bg-gray-800">
//                         Admin Dashboard
//                       </Link>
//                       <Link to="/products" className="w-full text-left px-4 py-2 hover:bg-gray-800">
//                         Manage Products
//                       </Link>
//                       <Link to="/users" className="w-full text-left px-4 py-2 hover:bg-gray-800">
//                         Manage Users
//                       </Link>
//                       <Link to="/orders" className="w-full text-left px-4 py-2 hover:bg-gray-800">
//                         Orders
//                       </Link>
//                       <Link to="/payments" className="w-full text-left px-4 py-2 hover:bg-gray-800">
//                         Payments
//                       </Link>
//                     </>
//                   ) : (
//                     <>
//                       <Link to="/account" className="w-full text-left px-4 py-2 hover:bg-gray-800">
//                         Manage Account
//                       </Link>
//                       <Link to="/orders" className="w-full text-left px-4 py-2 hover:bg-gray-800">
//                         My Orders
//                       </Link>
//                     </>
//                   )}
//                   <button
//                     onClick={logout}
//                     className="text-left w-full text-left px-4 py-2 hover:bg-gray-800"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="md:hidden">
//           <button onClick={toggleMenu}>
//             {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden flex flex-col space-y-2 mt-2 text-lg">
//           <Link to="/">Home</Link>
//           <Link to="/shop">Shop</Link>
//           <Link to="/cart">
//             <HiOutlineShoppingCart size={28} />
//           </Link>

//           {!user ? (
//             <>
//               <Link to="/signin">Signin</Link>
//               <Link to="/signup">Signup</Link>
//             </>
//           ) : (
//              <div>
//               <button
//                 onClick={toggleDropdown}
//                 className="md:flex items-center space-x-2"
//               >
//                 <HiOutlineUserCircle size={28} />
//               </button>
//               {dropdownOpen && (
//                 <div>
//                   {userData?.role === "admin" ? (
//                     <>
//                       <Link to="/dashboard">Dashboard</Link>
//                       <Link to="/products">Product Management</Link>
//                       <Link to="/users">User Management</Link>
//                       <Link to="/orders">Order Management</Link>
//                       <Link to="/payments">Payment Management</Link>
//                     </>
//                   ) : (
//                     <>
//                       <Link to="/account">Manage Account</Link>
//                       <Link to="/orders">My Orders</Link>
//                     </>
//                   )}
//                   <button onClick={logout} className="text-left">Logout</button>
//                 </div>
//               )}

//              </div>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Nav;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiOutlineUserCircle } from "react-icons/hi";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { useCart } from "../context/CartContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Nav = () => {
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // For both desktop & mobile
  const [menuOpen, setMenuOpen] = useState(false);

  const auth = getAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ Fetch user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // ✅ Outside click to close dropdown
   useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // ✅ Toggle dropdown
  const handleDropdownClick = () => {
    setDropdownOpen((prev) => !prev);
    setMenuOpen(false);
  };
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // ✅ Toggle menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setDropdownOpen(false);
  };

 const logout = async () => {
  try {
    await signOut(auth);
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/"); // ✅ Redirect to home
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <nav className="bg-transparent text-white border-b px-4 py-2 shadow">
      <div className="max-w-7xl mx-auto my-2 flex justify-between items-center">
        {/* Left: Logo + Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold">
            <RiLayoutMasonryFill size={28} />
          </Link>
          <div className="hidden md:flex space-x-6 text-lg">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
          </div>
        </div>

        {/* Right: Desktop */}
        <div className="hidden md:flex items-center space-x-6 text-lg">
          <Link to="/cart" className="relative">
            {totalQuantity > 0 && (
              <span className="absolute top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalQuantity}
              </span>
            )}
            <HiOutlineShoppingCart size={28} />
          </Link>

          {!user ? (
            <>
              <Link to="/signin">Signin</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <div className="relative"  ref={dropdownRef}>
              <button
                onClick={handleDropdownClick}
                className="px-3 py-2 rounded font-semibold"
              >
                <HiOutlineUserCircle size={28} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60   flex flex-col  z-10  bg-gray-900 border border-gray-700 rounded shadow-lg py-2">
                  {userData?.role === "admin" ? (
                    <>
                      <Link to="/admin" className="w-full text-left px-4 py-2 hover:bg-gray-800">
                        Admin Dashboard
                      </Link>
                      <Link to="/products" className="w-full text-left px-4 py-2 hover:bg-gray-800">
                        Manage Products
                      </Link>
                      <Link to="/customersdata" className="w-full text-left px-4 py-2 hover:bg-gray-800">
                        Manage Users
                      </Link>
                      <Link to="/allorders" className="w-full text-left px-4 py-2 hover:bg-gray-800">
                        Orders
                      </Link>
                      <Link to="/payments" className="w-full text-left px-4 py-2 hover:bg-gray-800">
                        Payments
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/account" className="w-full text-left px-4 py-2 hover:bg-gray-800">
                        Manage Account
                      </Link>
                      <Link to="/orders" className="w-full text-left px-4 py-2 hover:bg-gray-800">
                        My Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logout}
                    className=" w-full text-left px-4 py-2 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-2 text-lg">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart" className="relative">
            {totalQuantity > 0 && (
              <span className="absolute top-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalQuantity}
              </span>
            )}
            <HiOutlineShoppingCart size={28} />
          </Link>

          {!user ? (
            <>
              <Link to="/signin">Signin</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <div ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2"
              >
                <HiOutlineUserCircle size={28} />
              </button>

              {dropdownOpen && (
                <div  className="flex flex-col space-y-2 mt-2 text-white "> 
                  {userData?.role === "admin" ? (
                    <>
                      <Link to="/admin"className="w-full text-left px-4 py-2 hover:bg-gray-800" >Dashboard</Link>
                      <Link to="/products" className="w-full text-left px-4 py-2 hover:bg-gray-800" >Manage Products</Link>
                      <Link to="/customersdata" className="w-full text-left px-4 py-2 hover:bg-gray-800">Manage Users</Link>
                      <Link to="/allorders"className="w-full text-left px-4 py-2 hover:bg-gray-800"  >Order Management</Link>
                      <Link to="/payments" className="w-full text-left px-4 py-2 hover:bg-gray-800">Payment Management</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/account">Manage Account</Link>
                      <Link to="/orders">My Orders</Link>
                    </>
                  )}
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-800">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
