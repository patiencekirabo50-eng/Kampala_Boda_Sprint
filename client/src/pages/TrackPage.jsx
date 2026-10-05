import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Radar, Search, Plane, Ship, Clock } from 'lucide-react';
import { getBooking } from '../lib/api.js';

const statusStyles = {
  scheduled: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  checkin: { bg: 'bg-teal-50', text: 'text-teal-600', dot: 'bg-teal-500' },
  boarding: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  departed: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
  arrived: { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' },
};

export default function TrackPage() {
  const [params] = useSearchParams();
  const [ref, setRef] = useState(params.get('ref') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setError(null);
    setBooking(null);
    try {
      const data = await getBooking(ref.trim().toUpperCase());
      setBooking(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('ref')) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const status = booking?.liveStatus;
  const style = status ? statusStyles[status.status] || statusStyles.scheduled : null;

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 px-4 pt-12 pb-6 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Radar size={22} /> Track Trip
        </h1>
        <p className="text-sky-100 text-sm mt-1">Follow your flight or ferry status</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter booking reference (e.g. ABC123)"
            value={ref}
            onChange={e => setRef(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-wider focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 text-white px-4 rounded-xl font-semibold text-sm flex items-center gap-1 disabled:opacity-50"
          >
            <Search size={18} />
          </button>
        </form>

        {loading && <div className="text-center py-8 text-slate-400 text-sm">Looking up booking...</div>}

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm text-center">{error}</div>
        )}

        {/* Result */}
        {booking && status && style && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Status banner */}
            <div className={`${style.bg} px-4 py-4 flex items-center gap-3`}>
              <div className={`w-3 h-3 rounded-full ${style.dot} ${status.status === 'boarding' ? 'animate-pulse' : ''}`} />
              <div>
                <p className={`text-lg font-bold ${style.text}`}>{status.label}</p>
                <p className="text-xs text-slate-400">Current status</p>
              </div>
            </div>

            {/* Trip info */}
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${booking.type === 'flight' ? 'bg-sky-100' : 'bg-teal-100'}`}>
                  {booking.type === 'flight' ? <Plane size={16} className="text-sky-600" /> : <Ship size={16} className="text-teal-600" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{booking.operator}</p>
                  <p className="text-xs text-slate-400">{booking.tripNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-slate-700">{booking.departureTime}</p>
                  <p className="text-xs text-slate-400">{booking.origin}</p>
                </div>
                <div className="flex-1 text-center">
                  <Clock size={16} className="text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-300 mt-1">{booking.date}</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xl font-bold text-slate-700">{booking.arrivalTime}</p>
                  <p className="text-xs text-slate-400">{booking.destination}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Reference</span>
                  <span className="font-bold tracking-wider text-sky-600">{booking.ref}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Passengers</span>
                  <span className="font-medium text-slate-600">{booking.passengers.map(p => p.name).join(', ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <span className={`font-medium ${style.text}`}>{booking.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!booking && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">Enter your booking reference to track your trip.</p>
          </div>
        )}
      </div>
    </div>
  );
}
