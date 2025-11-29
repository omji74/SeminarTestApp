import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect("http://localhost:3001");

function Lobby() {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [participants, setParticipants] = useState([]);
  const [roomDetails, setRoomDetails] = useState(location.state?.roomData || {});
  
  const isHost = location.state?.isHost;
  const guestName = location.state?.name;

  useEffect(() => {
    // 1. Fetch Room Details if guest (Host already has them passed via state)
    if (!isHost) {
      axios.get(`http://localhost:3001/api/room/${roomCode}`).then(res => {
        setRoomDetails(res.data);
      });
    }

    // 2. Join Socket Room
    socket.emit('join_room', { roomCode, name: isHost ? 'Host' : guestName, isHost });

    // 3. Listen for Participant Updates
    socket.on('update_participants', (users) => {
      setParticipants(users);
    });

    // 4. Listen for Kick Event (Only affects the kicked user)
    socket.on('kicked_out', () => {
      alert("You have been kicked by the host.");
      navigate('/'); // Redirect to home
    });

    // Cleanup listener on unmount
    return () => {
      socket.off('update_participants');
      socket.off('kicked_out');
    };
  }, [roomCode, isHost, guestName, navigate]);

  const handleKick = (socketId) => {
    socket.emit('kick_user', { roomCode, socketIdToKick: socketId });
  };

  return (
    <div className="flex h-screen">
      {/* LEFT SIDE: Room Details */}
      <div className="w-1/3 bg-blue-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-4">{roomDetails.testName}</h1>
        <p className="text-xl mb-2">Code: <span className="font-mono bg-white text-blue-900 px-2 rounded">{roomCode}</span></p>
        <p>Organization: {roomDetails.orgName}</p>
        <p>Duration: {roomDetails.duration} Minutes</p>
        <div className="mt-10">
          <p className="text-sm opacity-75">Role: {isHost ? "HOST (Admin)" : "GUEST (Participant)"}</p>
        </div>
      </div>

      {/* RIGHT SIDE: Participants List */}
      <div className="w-2/3 bg-gray-50 p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Live Participants ({participants.length})
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {participants.map((user, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-4 shadow rounded-lg border">
              <span className="font-semibold text-lg">{user.name}</span>
              
              {/* Only Host sees the Kick button */}
              {isHost && (
                <button 
                  onClick={() => handleKick(user.socketId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                >
                  Kick Out
                </button>
              )}
            </div>
          ))}
          
          {participants.length === 0 && (
            <p className="text-gray-500 italic">Waiting for students to join...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lobby;