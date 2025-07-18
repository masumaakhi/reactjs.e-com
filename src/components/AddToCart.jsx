import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const AddToCart = () => {
  const { cartItems, dispatch } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <div className="mb-4 text-gray-100 text-sm flex items-center gap-2">
        <Link to="/">Home</Link>
        <FaChevronRight className="text-xs" />
        <Link to="/cart">Shopping Cart</Link>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-100">Shopping Cart</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-gray-100 text-xl">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100">
                      {item.name}
                    </h4>
                    <p className="text-gray-100 font-medium mt-1">
                      ${item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch({ type: "DECREASE_QUANTITY", payload: item.id })
                    }
                    className="bg-gray-100 px-3 py-1 rounded ml-4"
                  >
                    -
                  </button>
                  <span className="text-gray-100">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch({ type: "INCREASE_QUANTITY", payload: item.id })
                    }
                    className="bg-gray-100 px-3 py-1 rounded ml-4 "
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_ITEM", payload: item.id })
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded ml-4"
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="mt-4 px-4 bg-gray-100  py-2 border border-gray-300 rounded-full hover:bg-blue-200 transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-slate-600 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-100">
            Order Summary
          </h3>

          <div className="flex justify-between py-1 text-gray-100">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-gray-100">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 mb-2 text-gray-100">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="text-gray-100 flex justify-between font-bold text-lg border-t pt-3 mt-3">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button className="w-full mt-6 bg-gray-100  py-3 rounded-full hover:bg-blue-200 transition flex justify-center items-center gap-2">
              <FaChevronRight className="text-sm" />
              Checkout Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
