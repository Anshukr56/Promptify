import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setstate] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // FIXED: emial → email
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email, // FIXED
          password,
        });

        if (data.success) {
          setToken(data.token); // FIXED tokens → token
          setUser(data.user);
          localStorage.setItem("token", data.token); // FIXED getItem → setItem
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email, // FIXED
          password,
        });

        if (data.success) {
          setToken(data.token); // FIXED
          setUser(data.user);
          localStorage.setItem("token", data.token); // FIXED
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  });

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-[90%] max-w-sm"
      >
        <h1 className="text-center text-3xl font-semibold text-neutral-800 mb-2">
          {state}
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Welcome back! Please sign in to continue
        </p>

        {state !== "Login" && (
          <div className="border border-gray-300 px-5 py-2 flex items-center gap-3 rounded-full hover:border-gray-400 transition">
            <img
              src={assets.profile_icon}
              alt=""
              className="w-5 h-5 opacity-70"
            />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border border-gray-300 px-5 py-2 flex items-center gap-3 rounded-full hover:border-gray-400 transition">
          <img src={assets.email_icon} alt="" className="w-5 h-5 opacity-70" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email} // FIXED
            type="email"
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="Email id"
            required
          />
        </div>

        <div className="border border-gray-300 px-5 py-2 flex items-center gap-3 rounded-full hover:border-gray-400 transition">
          <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-70" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot password
        </p>

        <button className="bg-blue-600 w-full text-white py-2 rounded-full">
          {state === "Login" ? "Login" : "create account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setstate("Sign Up")}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setstate("Login")}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </form>
    </div>
  );
};

export default Login;
