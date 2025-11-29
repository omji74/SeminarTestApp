import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import HostLogin from './pages/HostLogin';
import HostDashboard from './pages/HostDashboard';
import Lobby from './pages/Lobby';
import './App.css'; // Import the styles

function App() {
  return (
    <Router>
      {/* The animated blobs background */}
      <div className="liquid-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/host/login" element={<HostLogin />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/lobby/:roomCode" element={<Lobby />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;