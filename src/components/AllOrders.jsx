import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const statusColors = {
  Shipped: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Delivered: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
  "On The Way": "bg-purple-100 text-purple-800",
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [statusMenuOpenId, setStatusMenuOpenId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const menuRef = useRef();
  const statusRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        statusRef.current &&
        !statusRef.current.contains(e.target)
      ) {
        setMenuOpenId(null);
        setStatusMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    setStatusMenuOpenId(null);
    setMenuOpenId(null);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Orders</h2>
        <input
          type="text"
          placeholder="Search order by id or status"
          className="mb-4 p-2 rounded bg-gray-800 border border-gray-600 w-full max-w-sm"
        />

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left text-sm uppercase">
              <th className="py-3 px-4">Order Number</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="py-3 px-4">{order.orderNumber || order.id}</td>
                <td className="py-3 px-4">
                   {order.shippingInfo?.firstName || "-"}  {"  "}
                  {order.shippingInfo?.lastName || "-"}{" "}
                </td>
                <td className="py-3 px-6">
                  {order.date?.toDate().toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.status] || "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 relative">
                  <button onClick={() => setMenuOpenId(
                    menuOpenId ===  order.id ? null :  order.id
                   )}>
                    <HiOutlineDotsVertical size={20} />
                  </button>

                  {menuOpenId === order.id && (
                    <div
                      ref={menuRef}
                      className="absolute z-10 right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg py-2"
                    >
                      {/* View Order */}
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-800"
                      >
                        View Details
                      </button>

                      {/* Change Status Button */}
                      <button
                        onClick={() =>
                          setStatusMenuOpenId(
                            statusMenuOpenId === order.id ? null : order.id
                          )
                        }
                        className="w-full text-left px-4 py-2 hover:bg-gray-800"
                      >
                        Change Status
                      </button>

                      {/* Status Dropdown */}
                      {statusMenuOpenId === order.id && (
                        <div
                          ref={statusRef}
                          className="absolute ml-2 w-40 bg-gray-800 border border-gray-600 rounded shadow-lg"
                        >
                          {[
                            "Pending",
                            "On The Way",
                            "Delivered",
                            "Shipped",
                          ].map((status) => (
                            <button
                              key={status}
                              className="w-full text-left px-4 py-2 hover:bg-gray-700"
                              onClick={() =>
                                handleStatusChange(order.id, status)
                              }
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Cancel Order */}
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, "Cancelled")
                        }
                        className="w-full text-left px-4 py-2 hover:bg-gray-800 text-red-400"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
