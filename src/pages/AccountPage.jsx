"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase"; // adjust as needed
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editingAddress, setEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
  const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      setUser(firebaseUser);
      await loadUserInfo(firebaseUser.uid);
      await loadUserOrders(firebaseUser.uid);
    } else {
      // 👇 Reset data and redirect to homepage
      setUser(null);
      setUserInfo(null);
      setOrders([]);
      navigate("/"); // 🔁 Redirect to home
    }
  });

  return () => unsubscribe();
}, [navigate]);

  const loadUserInfo = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserInfo(data);
      setNewAddress(data.address || "");
    }
  };

  const loadUserOrders = async (uid) => {
    const q = query(collection(db, "orders"), where("userId", "==", uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(data);
  };

  const handleAddressSave = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { ...userInfo, address: newAddress }, { merge: true });
    setUserInfo((prev) => ({ ...prev, address: newAddress }));
    setEditingAddress(false);
  };

  if (!user) return <div className="p-6 text-center text-gray-50">Loading...</div>;

  return (
    <div className="max-w-4xl my-3 mx-auto p-6 space-y-6 bg-slate-800 ">
      <h1 className="text-3xl font-bold text-gray-50">My Account</h1>

      {/* Personal Info */}
      <div className="bg-slate-900 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-50">Personal Information</h2>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-50">Full Name</p>
            <p className="text-sm text-gray-50">{userInfo?.fullName || user.displayName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-50">Email Address</p>
            <p className="text-sm text-gray-50">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-slate-900 rounded-xl shadow p-6 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-50">Address</h2>
          <p className="text-sm text-gray-50">{userInfo?.address || "No address provided"}</p>
        </div>
        <button
          onClick={() => setEditingAddress(true)}
          className="px-4 py-2 text-sm border text-gray-50 rounded hover:bg-slate-700"
        >
          Edit Address
        </button>
      </div>

      {/* Order History */}
      <div className="bg-slate-900 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-50">Order History</h2>
        <p className="mb-2 text-sm text-gray-50">
          Total Orders: {orders.length}
        </p>
        <div className="divide-y">
          {orders.length === 0 && (
            <p className="text-gray-50">No orders yet.</p>
          )}
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between py-2">
              <div>
                <p className="font-medium text-gray-50">Order #{order.id}</p>
                <p className="text-sm text-gray-50">
                  Date: {order.date?.toDate().toLocaleDateString() || "N/A"}
                </p>
                <p className="text-sm text-gray-50">
                  Status: {order.status || "Processing"}
                </p>
              </div>
              <div className="font-medium text-right text-gray-50">
                ${order.total?.toFixed(2) || "XX.XX"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Address Modal */}
      {editingAddress && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-40 z-50">
          <div className="bg-slate-700 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-50">Edit Address</h3>
            <textarea
              rows={4}
              className="w-full border rounded p-2 text-slate-100 bg-slate-800"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter your new address"
            />
            <div className="mt-4 flex justify-end gap-2 text-gray-50">
              <button
                onClick={() => setEditingAddress(false)}
                className="px-4 py-2 rounded text-gray-50 border hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddressSave}
                className="px-4 py-2 rounded text-gray-50 bg-slate-800 hover:bg-slate-900"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
