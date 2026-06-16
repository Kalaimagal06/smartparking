import { useEffect, useState } from 'react';
import ParkingGrid from '../components/ParkingGrid';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    fetchStats();
    fetchReservations();
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

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations/my-reservations');
      if (res.data.success) {
        setReservations(res.data.reservations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (reservationId: number) => {
    try {
      const res = await api.post(`/reservations/${reservationId}/cancel`);
      if (res.data.success) {
        // Refresh reservations list
        fetchReservations();
      } else {
        alert(res.data.message || 'Cancel failed');
      }
    } catch (err) {
      console.error(err);
      alert('Cancel failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center glass p-6 rounded-2xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-pink-400 border border-red-500/50 rounded hover:bg-red-500/30">
            Logout
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Total Slots</p>
              <p className="text-4xl font-bold mt-2 text-zinc-100">{stats.totalSlots}</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Available</p>
              <p className="text-4xl font-bold mt-2 text-zinc-300">{stats.availableSlots}</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Reserved</p>
              <p className="text-4xl font-bold mt-2 text-zinc-400">{stats.bookedSlots}</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <p className="text-zinc-400 text-sm uppercase">Occupied</p>
              <p className="text-4xl font-bold mt-2 text-pink-400">{stats.occupiedSlots}</p>
            </div>
          </div>
        )}

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">Select a Parking Slot</h2>
          <ParkingGrid />
        </div>

        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6">My Reservations</h2>
          {reservations.length === 0 ? (
            <p className="text-zinc-400">No reservations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="py-3 px-4 text-zinc-400">Slot</th>
                    <th className="py-3 px-4 text-zinc-400">Booking Date</th>
                    <th className="py-3 px-4 text-zinc-400">Duration</th>
                    <th className="py-3 px-4 text-zinc-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-zinc-800 hover:bg-zinc-900/60">
                      <td className="py-3 px-4 font-bold">{r.slot.slot_number}</td>
                      <td className="py-3 px-4">{new Date(r.booking_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {new Date(r.start_time).toLocaleTimeString()} - {new Date(r.end_time).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          r.status === 'ACTIVE' ? 'bg-green-500/20 text-zinc-300 border border-green-500/50' :
                          r.status === 'EXPIRED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50' :
                          r.status === 'CANCELLED' ? 'bg-gray-500/20 text-zinc-400' :
                          'bg-gray-500/20 text-zinc-400'
                        }`}>
                          {r.status}
                        </span>
                        {r.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleCancel(r.id)}
                            className="px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
