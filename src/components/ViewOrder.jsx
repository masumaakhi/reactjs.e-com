import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, Link } from "react-router-dom";

const statusColors = {
  Shipped: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Delivered: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
  "On The Way": "bg-purple-100 text-purple-800",
};

const ViewOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef  = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn("No such order!");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!order)  return <div className="text-white p-6">Order not found.</div>;

  // Calculate total if you want; otherwise use order.total
  const total = order.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) ?? order.total;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>

        {/* Breadcrumb */}
        <nav className="text-gray-400 text-sm mb-6 flex space-x-2">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>&gt;</span>
          <Link to="/allorders" className="hover:text-white">Orders</Link>
          <span>&gt;</span>
          <span className="text-white font-semibold">{order.orderNumber}</span>
        </nav>

        {/* Order & Shipping Info */}
        <div className="grid grid-cols-2 gap-6 border-b pb-4 border-gray-600">
          <div>
            <h3 className="font-semibold text-lg mb-2">Order Information</h3>
            <p><b>Order Number:</b> {order.orderNumber}</p>
            <p>
              <b>Customer:</b>{" "}
              {order.shippingInfo?.firstName || "N/A"}{" "}
              {order.shippingInfo?.lastName  || ""}
            </p>
            <p>
              <b>Date:</b> {order.date?.toDate().toLocaleDateString() || "N/A"}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  statusColors[order.status] || "bg-gray-300 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
            <p><b>Address:</b> {order.shippingInfo?.address || "N/A"}</p>
            <p><b>City:</b>    {order.shippingInfo?.city    || "N/A"}</p>
            <p><b>Country:</b> {order.shippingInfo?.country || "N/A"}</p>
            <p><b>Phone:</b>   {order.shippingInfo?.phone   || "N/A"}</p>
            <p><b>ZIP:</b>     {order.shippingInfo?.zip     || "N/A"}</p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Ordered Products</h3>
          {order.items?.length > 0 ? (
            order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-700 p-4 rounded mb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="font-medium">{item.name}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span>Qty: {item.quantity}</span>
                   <span>${Number(item.price).toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No products in this order.</p>
          )}
        </div>

        {/* Total */}
        <div className="mt-4 text-xl font-bold">
          Total: <span className="text-green-400">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
