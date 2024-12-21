import React, {useState} from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast"

function Home() {
    const [sessionId, setSessionId] = useState("");
    const [sessionName, setSessionName] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
  
    const handleCreateSession = async () => { 
        const toastId = toast.loading("Loading...");
        try{
            const res = await axiosInstance.post("/api/sessions", { name: sessionName }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            toast.success("Session created successfully");
            navigate(`/whiteboard/${res.data._id}`);
        }
        catch(error){
            console.error("error in session creation: ", error);
            toast.error("error in session creation, try again with proper care")
        }
        toast.dismiss(toastId)
    };
  
    const handleJoinSession = async () => {
        const toastId = toast.loading("Loading...");
        try {
          const token = localStorage.getItem("token"); // Retrieve the token from localStorage
          if (!token) {
            alert("You must be logged in to join a session.");
            return;
          }
      
          const res = await axiosInstance.get(`/api/sessions/${sessionId}`, {
            headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
          });
      
          if (res.status === 200) {
            navigate(`/whiteboard/${sessionId}`);
          }
          toast.success("joined successfully")
        } catch (error) {
          console.error("Error joining session:", error);
          alert(error.response?.data?.message || "Session not found.");
          toast.error("error in joining session")
        }
        toast.dismiss(toastId);
    };
      

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
  
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Collaborative Whiteboard</h1>

            {token ? (
            <>
                <p className="mt-4 text-xl">You are logged in!</p>
                <div className="mt-8">
                  <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mr-4">Logout</button>
                </div>
                <div className="mt-8">
                    <input
                      type="text"
                      placeholder="Enter Session Name"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="border px-3 py-2 rounded"
                    />
                    <button onClick={handleCreateSession} className="bg-blue-500 text-white px-4 py-2 rounded ml-4">
                      Create Session
                    </button>
                </div>
                <div className="mt-8">
                  <input
                    type="text"
                    placeholder="Enter Session ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="border px-3 py-2 rounded"
                  />
                  <button onClick={handleJoinSession} className="bg-green-500 text-white px-4 py-2 rounded ml-4">
                    Join Session
                  </button>
                </div>
            </>
            ) : (
                <div className="mt-8">
                  <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Login</Link>
                  <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">Register</Link>
                </div>
            )}

        </div>
    );
}

export default Home;
  