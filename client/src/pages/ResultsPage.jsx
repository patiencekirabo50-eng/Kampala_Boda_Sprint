import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plane, Ship, Clock, ArrowLeft } from 'lucide-react';
import { searchTrips } from '../lib/api.js';

export default function ResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const type = params.get('type') || 'flight';
  const origin = params.get('origin') || '';
  const destination = params.get('destination') || '';
  const date = params.get('date') || '';

  useEffect(() => {
    setLoading(true);
    searchTrips({ type, origin, destination, date })
      .then(data => { setTrips(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [type, origin, destination, date]);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 px-4 pt-10 pb-6 rounded-b-3xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sky-100 text-sm mb-3">
          <ArrowLeft size={18} /> Back to search
        </button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          {type === 'flight' ? <Plane size={20} /> : <Ship size={20} />}
          {trips.length} {type === 'flight' ? 'Flights' : 'Ferries'} Found
        </h1>
        <p className="text-sky-100 text-xs mt-1">
          {date} {origin && `· ${origin}`} {destination && `→ ${destination}`}
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading && (
          <div className="text-center py-12 text-slate-400">
            <div className="animate-spin inline-block w-8 h-8 border-3 border-sky-200 border-t-sky-600 rounded-full mb-3" />
            <p className="text-sm">Searching...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">{error}</div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">No trips found. Try different filters.</p>
          </div>
        )}

        {!loading && !error && trips.map(trip => (
          <button
            key={trip.id}
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${trip.type === 'flight' ? 'bg-sky-100' : 'bg-teal-100'}`}>
                  {trip.type === 'flight' ? <Plane size={16} className="text-sky-600" /> : <Ship size={16} className="text-teal-600" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{trip.operator}</p>
                  <p className="text-xs text-slate-400">{trip.number}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-sky-600">${trip.price}</p>
                <p className="text-xs text-slate-400">{trip.seats} seats left</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center flex-1">
                <p className="text-lg font-bold text-slate-700">{trip.departureTime}</p>
                <p className="text-xs text-slate-400">{trip.origin}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={11} /> {trip.duration}</p>
                <div className="w-full flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                  <div className="flex-1 h-0.5 bg-slate-200"></div>
                  {trip.stops > 0 && <div className="w-2 h-2 rounded-full bg-amber-400"></div>}
                  {trip.stops > 0 && <div className="flex-1 h-0.5 bg-slate-200"></div>}
                  <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{trip.stops === 0 ? 'Direct' : `${trip.stops} stop`}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-lg font-bold text-slate-700">{trip.arrivalTime}</p>
                <p className="text-xs text-slate-400">{trip.destination}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
