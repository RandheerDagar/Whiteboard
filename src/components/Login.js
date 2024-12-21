import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...")
    try {
      const res = await axiosInstance.post("/api/users/login", { username, password });
      localStorage.setItem("token", res.data.token);
      toast.success("User Logged In successfully");
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("error in logging");
    }
    toast.dismiss(toastId);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 shadow-md rounded" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}

export default Login;