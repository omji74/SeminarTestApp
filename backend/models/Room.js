const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  testName: String,
  duration: Number,
  orgName: String,
  participants: [{
    socketId: String,
    name: String
  }]
});

module.exports = mongoose.model('Room', RoomSchema);