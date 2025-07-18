import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setServerMessage("");

    const actionCodeSettings = {
      url: "http://localhost:3000/signin", // ✅ change this to your production domain
      handleCodeInApp: false,
    };

    try {
      await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
      setServerMessage("✅ Reset link sent! Please check your email.");
      reset();
      setTimeout(() => navigate("/signin"), 3000);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        setServerMessage("❌ No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setServerMessage("❌ Invalid email address.");
      } else {
        setServerMessage("❌ Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="max-w-md my-[9rem] mx-auto  p-6 bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-50 mb-4">
        Reset Your Password
      </h2>

      {serverMessage && (
        <p className="text-center text-sm text-gray-100 mb-4">{serverMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-gray-50">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 text-white bg-slate-950 rounded"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-xs">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-slate-600 hover:bg-slate-700  text-white py-2 rounded-md text-md font-medium"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
