const Room = require('../models/Room');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Event: User (Host or Guest) joins a room
    socket.on('join_room', async ({ roomCode, name, isHost }) => {
      socket.join(roomCode);
      
      if (!isHost) {
        // Add guest to database list
        await Room.updateOne(
          { roomCode }, 
          { $push: { participants: { socketId: socket.id, name } } }
        );
      }

      // Fetch updated room data and broadcast to everyone in the room
      const updatedRoom = await Room.findOne({ roomCode });
      if(updatedRoom) {
          io.to(roomCode).emit('update_participants', updatedRoom.participants);
      }
    });

    // Event: Host kicks a user
    socket.on('kick_user', async ({ roomCode, socketIdToKick }) => {
      // 1. Remove from DB
      await Room.updateOne(
        { roomCode },
        { $pull: { participants: { socketId: socketIdToKick } } }
      );

      // 2. Emit specific event to the kicked user's socket
      io.to(socketIdToKick).emit('kicked_out');

      // 3. Update the list for the Host and remaining users
      const updatedRoom = await Room.findOne({ roomCode });
      if(updatedRoom) {
        io.to(roomCode).emit('update_participants', updatedRoom.participants);
      }
    });

    socket.on('disconnect', () => {
      console.log("User Disconnected", socket.id);
    });
  });
};