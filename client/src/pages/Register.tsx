import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Role is fixed to USER for simple registration
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password, role: 'USER' });
      if (res.data.success) {
        // Clear any previous error
        setError('');
        // Optionally show a success toast (simple alert)
        alert('Registration successful! You can now log in.');
        setLoading(false);
        navigate('/login');
        return;
      } else {
        setError(res.data.message || 'Registration failed');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Create Account</h2>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:border-blue-500 focus:outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:border-blue-500 focus:outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-zinc-100 focus:border-blue-500 focus:outline-none"
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-zinc-100 font-semibold py-3 rounded-lg transition-colors mt-6">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-zinc-400">
          Already have an account? <Link to="/login" className="text-orange-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
