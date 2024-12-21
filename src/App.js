import React from "react";
import "./App.css"
import {Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Whiteboard from "./components/Whiteboard";
import Home from "./components/Home";
import PrivateRoute from "./utils/privateRoutes";


function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/whiteboard/:sessionId" element={<PrivateRoute><Whiteboard /></PrivateRoute>} />
        </Routes>
      </div>
  );
}

export default App;
