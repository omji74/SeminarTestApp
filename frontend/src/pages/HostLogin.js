import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HostLogin() {
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between Login and Signup
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const endpoint = isLoginView ? '/api/login' : '/api/signup';
      const url = `http://localhost:3001${endpoint}`;
      
      const res = await axios.post(url, form);

      if (isLoginView) {
        // --- LOGIN SUCCESS ---
        // 1. Save Token and Username to LocalStorage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        
        // 2. Redirect to Dashboard
        navigate('/host/dashboard');
      } else {
        // --- SIGNUP SUCCESS ---
        alert("Account created successfully! Please log in.");
        setIsLoginView(true); // Switch back to login view
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLoginView ? "Host Login" : "Create Host Account"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200"
          >
            {isLoginView ? "Log In" : "Sign Up"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError('');
                setForm({ username: '', password: '' });
              }}
              className="text-blue-600 font-semibold ml-1 hover:underline focus:outline-none"
            >
              {isLoginView ? "Sign Up" : "Log In"}
            </button>
          </p>
          <p className="mt-4 text-xs text-gray-400">
            <a href="/" className="hover:text-gray-600">← Back to Guest Entry</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HostLogin;