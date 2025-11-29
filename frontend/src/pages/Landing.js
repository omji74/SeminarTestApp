// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Landing() {
//   const [roomCode, setRoomCode] = useState('');
//   const [name, setName] = useState('');
//   const navigate = useNavigate();

//   const handleJoin = async () => {
//     try {
//       await axios.get(`http://localhost:3001/api/room/${roomCode}`);
//       // Pass name and role via state
//       navigate(`/lobby/${roomCode}`, { state: { name, isHost: false } });
//     } catch (err) {
//       alert("Invalid Room Code");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96">
//         <h1 className="text-2xl font-bold mb-4">Join Seminar Test</h1>
//         <input 
//           className="w-full p-2 border mb-2" 
//           placeholder="Enter Room Code" 
//           onChange={(e) => setRoomCode(e.target.value)}
//         />
//         <input 
//           className="w-full p-2 border mb-4" 
//           placeholder="Enter Your Name" 
//           onChange={(e) => setName(e.target.value)}
//         />
//         <button onClick={handleJoin} className="w-full bg-blue-500 text-white p-2 rounded">
//           Join Room
//         </button>
//         <p className="mt-4 text-sm text-center">
//           Are you a host? <a href="/host/login" className="text-blue-600">Login here</a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Landing;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Hash, User, Zap } from 'lucide-react';

function Landing() {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if(!roomCode || !name) return alert("Fill details");
    try {
      await axios.get(`http://localhost:3001/api/room/${roomCode}`);
      navigate(`/lobby/${roomCode}`, { state: { name, isHost: false } });
    } catch (err) {
      alert("Invalid Room Code");
    }
  };

  return (
    <div className="flex-center">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card"
        style={{ width: '450px', textAlign: 'center' }}
      >
        <Zap size={50} color="#fbc2eb" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Seminar<span style={{ color: '#3b82f6' }}>Live</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Enter the code displayed by your host
        </p>

        <div className="glass-input-group">
          <Hash className="input-icon" />
          <input 
            className="glass-input" 
            placeholder="Room Code (e.g. X9Y2)" 
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          />
        </div>

        <div className="glass-input-group">
          <User className="input-icon" />
          <input 
            className="glass-input" 
            placeholder="Your Name" 
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button onClick={handleJoin} className="liquid-btn">
          Join Session Now
        </button>

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
          <a href="/host/login" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '12px' }}>
            Are you a Host? Click here.
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default Landing;