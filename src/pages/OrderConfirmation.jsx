// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such order found.");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-8 text-center text-gray-500">Loading order details...</p>;

  const {
    items = [],
    total,
    subtotal,
    shipping,
    tax,
    paymentMethod,
    shippingInfo,
    date,
  } = order;

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 md:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left: Message + Billing */}
        <div>
          <h1 className="text-4xl font-bold text-gray-50 mb-4">
            Thank you for your purchase!
          </h1>
          <p className="text-gray-50 mb-6">
            Your order will be processed within 24 hours during working days.
            We will notify you by email once your order has been shipped.
          </p>

          <h2 className="text-xl font-semibold mb-2 text-gray-50">Billing address</h2>
          <div className="space-y-1 text-gray-50 text-sm">
            <p className="text-gray-50"><strong>Name:</strong> {shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p className="text-gray-50"><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.country}</p>
            <p className="text-gray-50"><strong>Phone:</strong> {shippingInfo.phone}</p>
          </div>

          <button className="mt-6 bg-red-400 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-full">
            Track Your Order
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-slate-950 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-50">Order Summary</h2>

          <div className="flex justify-between text-gray-50 text-sm mb-4">
            <span>Date:</span>
            <span>{date?.toDate().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-gray-50 text-sm mb-4">
            <span>Order Number:</span>
            <span>{order.id}</span>
          </div>
          <div className="flex justify-between text-gray-50 text-sm mb-6">
            <span>Payment Method:</span>
            <span>{paymentMethod}</span>
          </div>

          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex gap-3 items-center text-gray-50">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover" />
                <div>
                  <h4 className="text-sm font-medium text-gray-50">{item.name}</h4>
                  <p className="text-xs text-gray-50">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-100">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="pt-4 text-sm space-y-1 border-t">
            <div className="flex justify-between">
              <span className="text-gray-50">Sub Total:</span>
              <span className="text-gray-50">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-50">Shipping:</span>
              <span className="text-gray-50">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-50">Tax:</span>
              <span className="text-gray-50">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span className="text-gray-50">Order Total:</span>
              <span className="text-gray-50">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
