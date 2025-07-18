import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const CustomersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Customers</h2>
        <input
          type="text"
          placeholder="Search customer by name or email"
          className="p-2 rounded bg-gray-800 text-white"
        />
      </div>

      <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className="border-b border-gray-700 hover:bg-gray-800"
            >
              <td className="p-3">{index + 1}</td>
              <td className="p-3 font-semibold">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination UI */}
      <div className="flex justify-center mt-4">
        <button className="px-3 py-1 bg-gray-700 rounded-l hover:bg-gray-600">
          Previous
        </button>
        {[1, 2, 3, 4, 5].map(page => (
          <button
            key={page}
            className={`px-3 py-1 ${
              page === 1 ? "bg-indigo-600" : "bg-gray-700"
            } text-white hover:bg-indigo-500`}
          >
            {page}
          </button>
        ))}
        <button className="px-3 py-1 bg-gray-700 rounded-r hover:bg-gray-600">
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomersTable;
