import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api';
import { Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Slot {
  id: number;
  slot_number: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

export default function ParkingGrid() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlots();

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const socket = io(socketUrl);
    socket.on('slot_updated', (updatedSlot: Slot) => {
      setSlots((prev) => prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await api.get('/slots');
      if (res.data.success) {
        setSlots(res.data.slots);
      }
    } catch (err) {
      console.error('Failed to fetch slots', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleBook = async (slotId: number) => {
    try {
      const res = await api.post('/reservations', { slotId, durationHours: 2 });
      if (res.data.success) {
        navigate('/booking-result?status=success');
      } else {
        navigate('/booking-result?status=failed&msg=' + encodeURIComponent(res.data.message || 'Booking failed'));
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Booking failed';
      navigate('/booking-result?status=failed&msg=' + encodeURIComponent(msg));
    }
  };

  if (loading) return <div>Loading grid...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {slots.map((slot) => {
        let bgColor = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
        if (slot.status === 'OCCUPIED') bgColor = 'bg-slate-800 border-slate-900 text-zinc-100';
        if (slot.status === 'RESERVED') bgColor = 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';

        return (
          <div 
            key={slot.id} 
            className={`border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 ${bgColor}`}
            onClick={() => slot.status === 'AVAILABLE' ? openModal(slot) : null}
          >
            <Car size={32} className="mb-2" />
            <span className="font-bold text-lg">{slot.slot_number}</span>
            <span className="text-xs uppercase mt-1 opacity-80">{slot.status}</span>
          </div>
        );
      })}
      
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-4 text-zinc-100">Confirm Booking</h3>
            <p className="text-zinc-400 mb-8">
              Are you sure you want to book slot <strong className="text-orange-400">{selectedSlot.slot_number}</strong> for 2 hours?
            </p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setSelectedSlot(null)} className="px-5 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleBook(selectedSlot.id)} className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-pink-500/20">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
