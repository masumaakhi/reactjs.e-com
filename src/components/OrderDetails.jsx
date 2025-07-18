import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p className="text-center mt-10 text-gray-50">Loading orders...</p>;
  if (orders.length === 0)
    return <p className="text-center mt-10 text-gray-50">No orders found.</p>;

  return (
    <div className="max-w-4xl mx-auto my-5 rounded-sm bg-slate-900 px-6 py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-50">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-slate-900 shadow rounded-lg p-6 mb-6 border border-gray-200"
        >
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div>
              <p className="text-lg font-semibold text-gray-50">Order #{order.id}</p>
              <p className="text-sm text-gray-50">
                Total: ${order.total?.toFixed(2)}
              </p>
            </div>
            <div className="text-sm text-right text-gray-50 mt-2 sm:mt-0">
              <p>
                Date:{" "}
                {order.date?.toDate
                  ? order.date.toDate().toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                Status:{" "}
                <span className="text-green-600 font-semibold">
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div>
            <p className="font-semibold mb-4 text-gray-50">Ordered Items</p>
            <ul className="divide-y divide-gray-300">
              {order.items?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-contain bg-slate-600"
                    />
                    <p className="text-sm font-medium text-gray-50">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm text-gray-60">
                    Quantity: {item.quantity}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
