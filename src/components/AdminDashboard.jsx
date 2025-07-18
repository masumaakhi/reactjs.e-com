import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const AdminDashboard = () => {
  const [currentAdmin, setCurrentAdmin] = useState({ name: "", email: "" });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const auth = getAuth();

  // 1️⃣ Grab current admin’s profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Assuming you store name/email on the user record in Firestore too:
        const snap = await getDocs(collection(db, "users"));
        const adminDoc = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .find(u => u.id === user.uid);

        setCurrentAdmin({
          name: adminDoc?.name || user.displayName || "Admin",
          email: adminDoc?.email || user.email,
        });
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // 2️⃣ Fetch all users & orders
  useEffect(() => {
    const fetchData = async () => {
      // Users
      const userSnap = await getDocs(collection(db, "users"));
      const allUsers = userSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(allUsers);

      // Orders
      const orderSnap = await getDocs(collection(db, "orders"));
      const allOrders = orderSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(allOrders);
    };
    fetchData();
  }, []);

  // 3️⃣ Compute counts
  const totalOrders    = orders.length;
  const totalCustomers = users.filter(u => u.role === "customer").length;
  const totalAdmins    = users.filter(u => u.role === "admin").length;

  // 4️⃣ Map orders-per-customer
  const ordersByUser = orders.reduce((acc, o) => {
    acc[o.userId] = (acc[o.userId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-50">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8 to-slate-900">
        <div className="p-6 bg-slate-950 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-50">Total Orders</h2>
          <p className="text-3xl text-gray-50">{totalOrders}</p>
        </div>
        <div className="p-6 bg-slate-950 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-50">Total Customers</h2>
          <p className="text-3xl text-gray-50">{totalCustomers}</p>
        </div>
        <div className="p-6 bg-slate-950 rounded shadow">
          <h2 className="text-xl font-semibold text-gray-50">Total Admins</h2>
          <p className="text-3xl text-gray-50">{totalAdmins}</p>
        </div>
      </div>

      {/* Current Admin Info */}
      <div className="mb-8 p-6 bg-slate-950 rounded shadow">
        <h2 className="text-2xl font-semibold text-gray-50">Welcome, {currentAdmin.name}</h2>
        <p className="text-gray-100">{currentAdmin.email}</p>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-950 rounded shadow">
        <h2 className="px-6 py-4 text-xl font-semibold border-b text-gray-50">
          Customers &amp; Their Orders
        </h2>
        <table className="w-full table-auto">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-4 py-2 text-left text-gray-50">Name</th>
              <th className="px-4 py-2 text-left text-gray-50">Email</th>
              <th className="px-4 py-2 text-right text-gray-50">Orders Count</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u => u.role === "customer")
              .map(user => (
                <tr key={user.id} className="border-b text-gray-50 hover:bg-slate-700">
                  <td className="px-4 py-2 text-gray-50">{user.name}</td>
                  <td className="px-4 py-2 text-gray-50">{user.email}</td>
                  <td className="px-4 py-2 text-right text-gray-50">
                    {ordersByUser[user.id] || 0}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
