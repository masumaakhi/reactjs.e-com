import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const auth = getAuth();
  const googleAuthProvider = new GoogleAuthProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = res.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        role: "customer",
      });

      await updateProfile(user, {
        displayName: data.name,
      });

      alert("Signup successful!");
      reset();
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        role: "customer",
      });

      toast.success("Google signup successful!");
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      toast.warning("Google signup failed: " + error.message);
    }
  };

  return (
    <div className="max-w-md my-5 mx-auto p-6 bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-50 mb-4">
        Sign Up for E-Commerce Web
      </h2>
              <button
        onClick={handleGoogleSignIn}
        className="mt-6 w-full bg-blue-500 hover:bg-blue-400 mb-4 text-white py-2 rounded-md text-xl font-medium"
      >
        Sign Up with Google
      </button>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-50">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2 border text-white bg-slate-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-50">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-2 border rounded-md text-white bg-slate-950 focus:outline-none focus:ring-2 focus:ring-gray-100"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium text-gray-50">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-2 pr-10 border text-white bg-slate-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-50"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 font-medium text-gray-50">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="w-full px-4 py-2 pr-10 border text-white bg-slate-950 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-50"
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full  rounded-md font-medium border bg-slate-600 hover:bg-slate-700  text-white py-2  text-md"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-50">
        Already have an account?{" "}
        <a href="/signin" className="text-orange-500 hover:underline">
          Sign in here
        </a>
      </p>

      {/* Google Signup */}

    </div>
  );
};

export default Signup;
