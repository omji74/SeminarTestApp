import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HostDashboard() {
  const [form, setForm] = useState({ testName: '', duration: '', orgName: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const createRoom = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/room/create-room', {
        ...form, token
      });
      // Navigate to lobby as Host
      navigate(`/lobby/${res.data.roomCode}`, { state: { isHost: true, roomData: res.data.room } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-8">Welcome, {username}</h1>
      
      <div className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto">
        <h2 className="text-xl mb-4">Create New Test Room</h2>
        <input className="w-full mb-2 p-2 border" placeholder="Test Name" onChange={e => setForm({...form, testName: e.target.value})} />
        <input className="w-full mb-2 p-2 border" placeholder="Duration (mins)" onChange={e => setForm({...form, duration: e.target.value})} />
        <input className="w-full mb-4 p-2 border" placeholder="Organization Name" onChange={e => setForm({...form, orgName: e.target.value})} />
        
        <button onClick={createRoom} className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Generate Room
        </button>
      </div>
    </div>
  );
}

export default HostDashboard;