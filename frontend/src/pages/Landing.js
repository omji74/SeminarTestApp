import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Landing() {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      await axios.get(`http://localhost:3001/api/room/${roomCode}`);
      // Pass name and role via state
      navigate(`/lobby/${roomCode}`, { state: { name, isHost: false } });
    } catch (err) {
      alert("Invalid Room Code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Join Seminar Test</h1>
        <input 
          className="w-full p-2 border mb-2" 
          placeholder="Enter Room Code" 
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <input 
          className="w-full p-2 border mb-4" 
          placeholder="Enter Your Name" 
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleJoin} className="w-full bg-blue-500 text-white p-2 rounded">
          Join Room
        </button>
        <p className="mt-4 text-sm text-center">
          Are you a host? <a href="/host/login" className="text-blue-600">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Landing;