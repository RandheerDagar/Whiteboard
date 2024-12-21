const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });
  
  module.exports = mongoose.model("Session", SessionSchema);