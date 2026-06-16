import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function BookingResult() {
  const query = useQuery();
  const navigate = useNavigate();
  const status = query.get('status');
  const message = query.get('msg');

  useEffect(() => {
    const timer = setTimeout(() => {
      // After showing result, go back to dashboard
      navigate('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const renderContent = () => {
    if (status === 'success') {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <svg className="w-16 h-16 text-emerald-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Booking Successful!</h2>
          <p className="text-zinc-400">Your parking slot has been reserved.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <svg className="w-16 h-16 text-rose-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Booking Failed</h2>
        <p className="text-zinc-400">{message || 'Unable to reserve the slot.'}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
}
