import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

function Whiteboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const socket = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [tool, setTool] = useState("draw");
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);  // State to hold the list of users in the session

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated.");
      navigate("/login");
      return;
    }
  
    // Decode the token to get userId
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    socket.current.emit("joinSession", { sessionId, userId });

    socket.current.on("sessionError", (data) => {
      alert(data.message);
      navigate("/");
    });

    socket.current.on("drawing", (data) => {
      const ctx = canvasRef.current.getContext("2d");
      const img = new Image();
      img.src = data;
      img.onload = () => ctx.drawImage(img, 0, 0);
    });

    socket.current.on("userJoined", ({ userId }) => {
      console.log(`${userId} joined the session.`);
      setUsers((prevUsers) => [...prevUsers, userId]);  // Update user list
    });

    socket.current.on("sessionUsers", (users) => {
      setUsers(users);  // Initialize the user list when the session starts
    });

    socket.current.on("userLeft", ({ userId }) => {
      console.log(`${userId} left the session.`);
      setUsers((prevUsers) => prevUsers.filter(user => user !== userId));  // Remove user who left
    });

    return () => {
        socket.current.emit("leaveSession", { sessionId, userId });
        socket.current.disconnect();
    }
  }, [sessionId, navigate]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = tool === "erase" ? "#FFFFFF" : color;
    ctx.lineWidth = tool === "erase" ? 20 : lineWidth;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();

    const dataUrl = canvasRef.current.toDataURL();
    setHistory((prevHistory) => [...prevHistory, dataUrl]);

    socket.current.emit("drawing", { sessionId, drawingData: dataUrl });
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");
    const previousState = history[history.length - 2];
    setHistory((prevHistory) => prevHistory.slice(0, -1));

    const img = new Image();
    img.src = previousState || "";
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const handleLeaveSession = () => {
    socket.current.emit("leaveSession", { sessionId, userId: "random-user-id" });
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold my-4">Whiteboard Session: {sessionId}</h1>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border"
        />
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="draw">Draw</option>
          <option value="erase">Erase</option>
        </select>
        <input
          type="number"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="border px-2 py-1 rounded"
          min={1}
          max={50}
        />
        <button
          onClick={handleUndo}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Undo
        </button>
        <button
          onClick={handleLeaveSession}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Leave Session
        </button>
      </div>

      <div className="flex gap-4">

        <div className="w-1/4 border p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-bold mb-4">Users in this session:</h2>
          <ul>
            {users.map((user, index) => (
              <li key={index} className="text-sm font-medium py-1">
                {user.username} {/* Display username instead of ID */}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4">
          <canvas
            ref={canvasRef}
            className="border"
            width={800}
            height={600}
            style={{ backgroundColor: "white" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          ></canvas>
        </div>
      </div>

    </div>
  );
}

export default Whiteboard;

