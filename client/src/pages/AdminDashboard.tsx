import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ParkingGrid from '../components/ParkingGrid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = stats ? [
    { name: 'Available', value: stats.availableSlots, fill: '#10b981' },
    { name: 'Reserved', value: stats.bookedSlots, fill: '#eab308' },
    { name: 'Occupied', value: stats.occupiedSlots, fill: '#ef4444' }
  ] : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center glass p-6 rounded-2xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-pink-400 border border-red-500/50 rounded hover:bg-red-500/30">
            Logout
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Total Slots</p>
              <p className="text-3xl font-bold mt-2 text-zinc-100">{stats.totalSlots}</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Available</p>
              <p className="text-3xl font-bold mt-2 text-zinc-300">{stats.availableSlots}</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Reserved</p>
              <p className="text-3xl font-bold mt-2 text-zinc-400">{stats.bookedSlots}</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Occupied</p>
              <p className="text-3xl font-bold mt-2 text-pink-400">{stats.occupiedSlots}</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Today's Books</p>
              <p className="text-3xl font-bold mt-2 text-orange-400">{stats.todaysReservations}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">Live Parking Map</h2>
                <ParkingGrid />
            </div>

            <div className="glass p-8 rounded-2xl">
                <h2 className="text-xl font-bold mb-6">Slot Distribution</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a'}} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
