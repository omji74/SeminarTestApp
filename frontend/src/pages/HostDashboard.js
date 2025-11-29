import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Clock, Building2, FileText, ArrowRight } from 'lucide-react';

function HostDashboard() {
  const [form, setForm] = useState({ testName: '', duration: '', orgName: '' });
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  // Check Auth on Load
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/host/login');
    }
  }, [navigate]);

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Note: Using the updated route structure
      const res = await axios.post('http://localhost:3001/api/room/create-room', {
        ...form, 
        token 
      });

      navigate(`/lobby/${res.data.roomCode}`, { 
        state: { isHost: true, roomData: res.data.room } 
      });

    } catch (err) {
      console.error(err);
      alert("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="flex-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card"
        style={{ width: '500px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
            <LayoutDashboard color="#a1c4fd" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Host Dashboard</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Welcome back, {username}
            </p>
          </div>
        </div>

        <form onSubmit={createRoom}>
          <div className="glass-input-group">
            <FileText className="input-icon" size={18} />
            <input 
              className="glass-input" 
              placeholder="Test / Seminar Name" 
              required
              onChange={e => setForm({...form, testName: e.target.value})} 
            />
          </div>

          <div className="glass-input-group">
            <Clock className="input-icon" size={18} />
            <input 
              className="glass-input" 
              placeholder="Duration (Minutes)" 
              type="number"
              required
              onChange={e => setForm({...form, duration: e.target.value})} 
            />
          </div>

          <div className="glass-input-group">
            <Building2 className="input-icon" size={18} />
            <input 
              className="glass-input" 
              placeholder="Organization Name" 
              required
              onChange={e => setForm({...form, orgName: e.target.value})} 
            />
          </div>
          
          <button type="submit" className="liquid-btn" style={{ marginTop: '1rem' }}>
            Generate Room Code <ArrowRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default HostDashboard;