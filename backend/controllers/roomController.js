const Room = require('../models/Room');
const jwt = require('jsonwebtoken');

exports.createRoom = async (req, res) => {
  const { testName, duration, orgName, token } = req.body;
  try {
    const decoded = jwt.verify(token, 'secretKey');
    // Generate simple 6-char code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newRoom = await Room.create({
      hostId: decoded.id,
      roomCode,
      testName,
      duration,
      orgName,
      participants: []
    });
    res.json({ roomCode, room: newRoom });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized or Error creating room" });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.code });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};