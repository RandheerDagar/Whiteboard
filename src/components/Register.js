import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import {toast} from "react-hot-toast"

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("loading")
    try {
      await axiosInstance.post("/api/users/register", { username, password });
      toast.success("User Registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("cannot registered user, Please try again...")
    }
    toast.dismiss(toastId);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 shadow-md rounded" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-4">Register</h2>
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}

export default Register;