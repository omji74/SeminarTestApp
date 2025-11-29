import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Building2, Copy, LogOut, ShieldAlert } from 'lucide-react';

const socket = io.connect("http://localhost:3001");

function Lobby() {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [participants, setParticipants] = useState([]);
  const [roomDetails, setRoomDetails] = useState(location.state?.roomData || {});
  
  const isHost = location.state?.isHost;
  const guestName = location.state?.name;

  useEffect(() => {
    // 1. Get Room Details (if Guest)
    if (!isHost) {
      axios.get(`http://localhost:3001/api/room/${roomCode}`).then(res => {
        setRoomDetails(res.data);
      });
    }

    // 2. Socket Logic
    socket.emit('join_room', { roomCode, name: isHost ? 'Host' : guestName, isHost });

    socket.on('update_participants', (users) => {
      setParticipants(users);
    });

    socket.on('kicked_out', () => {
      alert("You have been removed from the session.");
      navigate('/'); 
    });

    return () => {
      socket.off('update_participants');
      socket.off('kicked_out');
    };
  }, [roomCode, isHost, guestName, navigate]);

  const handleKick = (socketId) => {
    if(window.confirm("Are you sure you want to kick this user?")) {
      socket.emit('kick_user', { roomCode, socketIdToKick: socketId });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room Code Copied!");
  };

  // --- INLINE STYLES FOR LAYOUT ---
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    height: 'calc(100vh - 80px)', // Full height minus padding
    alignItems: 'stretch'
  };

  return (
    <div style={containerStyle}>
      
      {/* LEFT PANEL: INFO */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-card"
        style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ marginBottom: '20px' }}>
          <span style={{ 
            background: isHost ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)', 
            padding: '5px 12px', 
            borderRadius: '20px', 
            fontSize: '0.8rem',
            color: isHost ? '#93c5fd' : 'white',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            {isHost ? "HOST CONTROL" : "PARTICIPANT VIEW"}
          </span>
        </div>

        <h1 style={{ fontSize: '2.5rem', margin: '10px 0', lineHeight: '1.1' }}>
          {roomDetails.testName || "Loading..."}
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', marginBottom: '30px' }}>
          <Building2 size={16} />
          <span>{roomDetails.orgName || "Organization"}</span>
        </div>

        {/* CODE BOX */}
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '20px', 
          borderRadius: '16px', 
          marginBottom: '20px',
          border: '1px solid var(--glass-border)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Room Entry Code</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#a1c4fd' }}>
              {roomCode}
            </span>
            <button 
              onClick={copyCode}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', opacity: 0.7 }}
              title="Copy Code"
            >
              <Copy size={24} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px', width: '100%' }}>
            <Clock color="#fbc2eb" />
            <div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Duration</div>
              <div style={{ fontWeight: 'bold' }}>{roomDetails.duration} Minutes</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL: PARTICIPANTS */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-card"
        style={{ flex: '1.5', minWidth: '300px', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users color="#a1c4fd" /> Live Participants
          </h2>
          <span style={{ background: 'white', color: 'black', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {participants.length}
          </span>
        </div>

        {/* SCROLLABLE LIST AREA */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          <AnimatePresence>
            {participants.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
                Waiting for students to join...
              </div>
            ) : (
              participants.map((user) => (
                <motion.div
                  key={user.socketId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '15px',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    border: '1px solid transparent'
                  }}
                  whileHover={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '1.2rem'
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '1.1rem' }}>{user.name}</span>
                  </div>

                  {isHost && (
                    <button
                      onClick={() => handleKick(user.socketId)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.4)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                    >
                      <LogOut size={14} /> Kick
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Lobby;