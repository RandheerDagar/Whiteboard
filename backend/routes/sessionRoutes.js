const express = require("express");
const { createSession, getSessions } = require("../controllers/sessionController");
const router = express.Router();
const Session = require("../models/session")

router.post("/", createSession);
router.get("/", getSessions);

router.get("/:sessionId", async (req, res) => {
    try {
      const session = await Session.findById(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.status(200).json({ message: "Session exists" });
    } catch (error) {
      res.status(500).json({ message: "Error checking session" });
    }
});

module.exports = router;