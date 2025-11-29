import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import HostLogin from './pages/HostLogin';
import HostDashboard from './pages/HostDashboard';
import Lobby from './pages/Lobby';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/host/login" element={<HostLogin />} />
        <Route path="/host/dashboard" element={<HostDashboard />} />
        <Route path="/lobby/:roomCode" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;