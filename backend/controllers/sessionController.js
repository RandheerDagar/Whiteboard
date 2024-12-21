const Session = require("../models/session");

exports.createSession = async (req, res) => {
  try {
    const { name } = req.body;
    const session = new Session({ name, createdBy: req.user.id });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: "Error creating session" });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user.id });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sessions" });
  }
};
