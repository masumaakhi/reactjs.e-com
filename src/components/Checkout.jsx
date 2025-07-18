// // src/pages/Checkout.jsx
// import React, { useState } from "react";
// import { getAuth } from "firebase/auth";
// import { useCart } from "../context/CartContext";
// import { useLocation, useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { collection, addDoc, Timestamp } from "firebase/firestore";

// const Checkout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const buyNowProduct = location.state?.product || null;
//   const fromBuyNow = location.state?.fromBuyNow || false;

//   const { cartItems, dispatch } = useCart();

//   const itemsToCheckout = fromBuyNow
//     ? [{ ...buyNowProduct, quantity: 1 }]
//     : cartItems;

//   const subtotal = itemsToCheckout.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
//   const shipping = 5;
//   const tax = Math.round(subtotal * 0.1);
//   const total = subtotal + shipping + tax;

//   const [shippingInfo, setShippingInfo] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     phone: "",
//     city: "",
//     zip: "",
//     country: "",
//   });

//   const handleInputChange = (e) => {
//     setShippingInfo({
//       ...shippingInfo,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const increaseQty = (id) =>
//     dispatch({ type: "INCREASE_QUANTITY", payload: id });
//   const decreaseQty = (id) =>
//     dispatch({ type: "DECREASE_QUANTITY", payload: id });
//   const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
//   const clearCart = () => dispatch({ type: "CLEAR_CART" });

//  const placeOrder = async () => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (!user) {
//     console.error("User not logged in.");
//     return;
//   }
//   const generateOrderNumber = () => {
//   return "ORD" + Math.floor(100000 + Math.random() * 900000);
// };

//   const orderData = {
//     orderNumber: generateOrderNumber(),
//     shippingInfo,
//     items: itemsToCheckout,
//     subtotal,
//     shipping,
//     tax,
//     total,
//     status: "Processing",
//     date: Timestamp.now(),
//     paymentMethod: "Cash on Delivery",
//     userId: user.uid,
    
//   };

//   try {
//     const docRef = await addDoc(collection(db, "orders"), orderData);

//     // ✅ Navigate to dynamic order confirmation page
//     navigate(`/order-success/${docRef.id}`);

//     if (!fromBuyNow) clearCart();
//   } catch (error) {
//     console.error("Error saving order:", error);
//   }
// };


//   return (
//     <div className=" bg-slate-900 py-10 px-4 md:px-16">
//       <h1 className="text-4xl font-bold text-gray-50 mb-2">Checkout</h1>
//       <p className="text-gray-50 mb-8">
//         Please fill out the address form if you haven’t saved it
//       </p>

//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Shipping & Coupon */}
//         <div className="space-y-6">
//           {/* Shipping Address */}
//           <div className="bg-slate-950 border p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4 text-gray-50">Shipping Address</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 className="p-2 border rounded col-span-1 text-white bg-slate-900"
//                 value={shippingInfo.firstName}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 className="p-2 border rounded col-span-1 text-white bg-slate-900"
//                 value={shippingInfo.lastName}
//                 onChange={handleInputChange}
//               />
//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Address"
//                 className="p-2 border rounded col-span-2 text-white bg-slate-900"
//                 value={shippingInfo.address}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Phone"
//                 className="p-2 border rounded text-white bg-slate-900"
//                 value={shippingInfo.phone}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 className="p-2 border rounded text-white bg-slate-900"
//                 value={shippingInfo.city}
//                 onChange={handleInputChange}
//               />
//               <input
//                 type="text"
//                 name="zip"
//                 placeholder="ZIP Code"
//                 className="p-2 border rounded text-white bg-slate-900"
//                 value={shippingInfo.zip}
//                 onChange={handleInputChange}
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 className="p-2 border rounded text-white bg-slate-900"
//                 value={shippingInfo.country}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>

//           {/* Coupon */}
//           <div className="bg-slate-950 border p-6 rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold mb-2 text-gray-50">
//               Enter Your Coupon Code
//             </h2>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="e.g. YOUR_COUPON_CODE"
//                 className="flex-1 p-2 border rounded text-white bg-slate-900"
//               />
//               <button className="px-4 py-2 bg-gray-100 text-slate-900 border rounded hover:bg-gray-300">
//                 Submit
//               </button>
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="pt-4 border mt-4 bg-slate-950 shadow-md rounded-lg p-4">
//             <h3 className="text-2xl font-semibold mb-2 text-gray-50">Payment Method</h3>
//             <div className="flex items-center gap-2 text-xl">
//               <input
//                 type="radio"
//                 id="cod"
//                 name="paymentMethod"
//                 value="Cash on Delivery"
//                 defaultChecked
//                 className="accent-green-900 text-xl"
//               />
//               <label htmlFor="cod" className="text-gray-50 text-xl">
//                 Cash on Delivery (COD)
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="bg-slate-950 p-6 border rounded-lg shadow-md space-y-4">
//           <h2 className="text-xl font-semibold text-gray-50">Order Items</h2>

//           {itemsToCheckout.length === 0 ? (
//             <p className="text-gray-50">Your cart is empty.</p>
//           ) : (
//             <>
//               {itemsToCheckout.map((item) => (
//                 <div key={item.id} className="border-b pb-4 mb-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-16 h-16 object-contain"
//                       />
//                       <p className="text-sm font-medium text-gray-50">{item.name}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-sm">
//                         ${item.price}
//                       </span>
//                       {!fromBuyNow && (
//                         <button
//                           className="bg-red-500 text-white px-2 py-1 rounded"
//                           onClick={() => removeItem(item.id)}
//                         >
//                           ✕
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {!fromBuyNow && (
//                     <div className="flex items-center gap-2 mt-2">
//                       <button
//                         className="px-3 py-1 bg-gray-50 rounded"
//                         onClick={() => decreaseQty(item.id)}
//                       >
//                         −
//                       </button>
//                       <span className="px-2 text-gray-50">{item.quantity}</span>
//                       <button
//                         className="px-3 py-1 bg-gray-50 rounded"
//                         onClick={() => increaseQty(item.id)}
//                       >
//                         ＋
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {!fromBuyNow && (
//                 <button
//                   onClick={clearCart}
//                   className="text-sm text-red-600 underline"
//                 >
//                   Clear Cart
//                 </button>
//               )}

//               {/* Summary */}
//               <div className="border-t pt-4">
//                 <h3 className="font-semibold text-lg mb-2 text-gray-50">Order Summary</h3>
//                 <div className="space-y-1 text-sm">
//                   <div className="flex justify-between">
//                     <span className="font-bold text-gray-50">Subtotal:</span>
//                     <span className="text-gray-50">${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-bold text-gray-50 ">Shipping:</span>
//                     <span className="text-gray-50">${shipping.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-bold text-gray-50">Tax:</span>
//                     <span className="text-gray-50">${tax.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between font-bold text-lg">
//                     <span className="font-bold text-gray-50">Total:</span>
//                     <span className="text-gray-50">${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//                 <button
//                   className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
//                   onClick={placeOrder}
//                 >
//                   Place Order
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const buyNowProduct = location.state?.product || null;

  const { cartItems, dispatch } = useCart();
  const auth = getAuth();

  const itemsToCheckout = cartItems;

  const subtotal = itemsToCheckout.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 5;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    city: "",
    zip: "",
    country: "",
  });

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const increaseQty = (id) =>
    dispatch({ type: "INCREASE_QUANTITY", payload: id });
  const decreaseQty = (id) =>
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const placeOrder = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not logged in.");
      return;
    }

    const generateOrderNumber = () => {
      return "ORD" + Math.floor(100000 + Math.random() * 900000);
    };

    const orderData = {
      orderNumber: generateOrderNumber(),
      shippingInfo,
      items: itemsToCheckout,
      subtotal,
      shipping,
      tax,
      total,
      status: "Processing",
      date: Timestamp.now(),
      paymentMethod: "Cash on Delivery",
      userId: user.uid,
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      navigate(`/order-success/${docRef.id}`);

      if (!buyNowProduct) clearCart();
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  return (
    <div className="bg-slate-900 py-10 px-4 md:px-16">
      <h1 className="text-4xl font-bold text-gray-50 mb-2">Checkout</h1>
      <p className="text-gray-50 mb-8">
        Please fill out the address form if you haven’t saved it
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Section - Shipping & Payment */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-slate-950 border p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-50">
              Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name" className="p-2 border rounded col-span-1 text-white bg-slate-900" value={shippingInfo.firstName} onChange={handleInputChange} required />
              <input type="text" name="lastName" placeholder="Last Name" className="p-2 border rounded col-span-1 text-white bg-slate-900" value={shippingInfo.lastName} onChange={handleInputChange} />
              <input type="text" name="address" placeholder="Address" className="p-2 border rounded col-span-2 text-white bg-slate-900" value={shippingInfo.address} onChange={handleInputChange} required />
              <input type="text" name="phone" placeholder="Phone" className="p-2 border rounded text-white bg-slate-900" value={shippingInfo.phone} onChange={handleInputChange} required />
              <input type="text" name="city" placeholder="City" className="p-2 border rounded text-white bg-slate-900" value={shippingInfo.city} onChange={handleInputChange} />
              <input type="text" name="zip" placeholder="ZIP Code" className="p-2 border rounded text-white bg-slate-900" value={shippingInfo.zip} onChange={handleInputChange} />
              <input type="text" name="country" placeholder="Country" className="p-2 border rounded text-white bg-slate-900" value={shippingInfo.country} onChange={handleInputChange} />
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-4 border mt-4 bg-slate-950 shadow-md rounded-lg p-4">
            <h3 className="text-2xl font-semibold mb-2 text-gray-50">Payment Method</h3>
            <div className="flex items-center gap-2 text-xl">
              <input type="radio" id="cod" name="paymentMethod" value="Cash on Delivery" defaultChecked className="accent-green-900 text-xl" />
              <label htmlFor="cod" className="text-gray-50 text-xl">
                Cash on Delivery (COD)
              </label>
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="bg-slate-950 p-6 border rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-50">Order Items</h2>

          {itemsToCheckout.length === 0 ? (
            <p className="text-gray-50">Your cart is empty.</p>
          ) : (
            <>
              {itemsToCheckout.map((item) => (
                <div key={item.id} className="border-b pb-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                      <p className="text-sm font-medium text-gray-50">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-sm">
                        ${item.price}
                      </span>
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeItem(item.id)}>
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button className="px-3 py-1 bg-gray-50 rounded" onClick={() => decreaseQty(item.id)}>
                      −
                    </button>
                    <span className="px-2 text-gray-50">{item.quantity}</span>
                    <button className="px-3 py-1 bg-gray-50 rounded" onClick={() => increaseQty(item.id)}>
                      ＋
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="text-sm text-red-600 underline">
                Clear Cart
              </button>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-50">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-50">Subtotal:</span>
                    <span className="text-gray-50">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-50">Shipping:</span>
                    <span className="text-gray-50">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-50">Tax:</span>
                    <span className="text-gray-50">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span className="font-bold text-gray-50">Total:</span>
                    <span className="text-gray-50">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition" onClick={placeOrder}>
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
