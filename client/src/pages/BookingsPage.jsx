import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Ship, Inbox, ArrowRight } from 'lucide-react';
import { getBookings } from '../lib/api.js';

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 px-4 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white">My Bookings</h1>
        <p className="text-sky-100 text-sm mt-1">{bookings.length} confirmed booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading && <div className="text-center py-12 text-slate-400 text-sm">Loading...</div>}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-slate-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3">
              <Inbox size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm mb-4">No bookings yet</p>
            <button
              onClick={() => navigate('/')}
              className="bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Search for trips
            </button>
          </div>
        )}

        {!loading && bookings.map(b => (
          <div key={b.ref} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${b.type === 'flight' ? 'bg-sky-100' : 'bg-teal-100'}`}>
                  {b.type === 'flight' ? <Plane size={16} className="text-sky-600" /> : <Ship size={16} className="text-teal-600" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{b.operator}</p>
                  <p className="text-xs text-slate-400">{b.tripNumber}</p>
                </div>
              </div>
              <span className="text-xs font-bold tracking-wider text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">{b.ref}</span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="text-center flex-1">
                <p className="text-base font-bold text-slate-700">{b.departureTime}</p>
                <p className="text-xs text-slate-400">{b.origin}</p>
              </div>
              <div className="flex-1 text-center text-slate-300">→</div>
              <div className="text-center flex-1">
                <p className="text-base font-bold text-slate-700">{b.arrivalTime}</p>
                <p className="text-xs text-slate-400">{b.destination}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                <p className="text-xs text-slate-400">{b.date} · {b.passengers.length} passenger{b.passengers.length !== 1 ? 's' : ''}</p>
                <p className="text-sm font-bold text-sky-600">${b.totalAmount}</p>
              </div>
              <button
                onClick={() => navigate(`/track?ref=${b.ref}`)}
                className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                Track <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
