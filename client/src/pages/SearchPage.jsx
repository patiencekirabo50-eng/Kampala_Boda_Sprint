import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Ship, ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import { getAirports, getPorts } from '../lib/api.js';

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('flight');
  const [places, setPlaces] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(formatDate(new Date()));
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    setType('flight');
    getAirports().then(setPlaces).catch(() => {});
  }, []);

  useEffect(() => {
    if (type === 'flight') {
      getAirports().then(setPlaces).catch(() => {});
    } else {
      getPorts().then(setPlaces).catch(() => {});
    }
    setOrigin('');
    setDestination('');
  }, [type]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { value: formatDate(d), label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDateLabel(d) };
  });

  const handleSearch = () => {
    const params = new URLSearchParams({ type, date });
    if (origin) params.set('origin', origin);
    if (destination) params.set('destination', destination);
    navigate(`/results?${params.toString()}`);
  };

  const canSearch = true; // can search without specific origin/destination to see all

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-white/20 p-2 rounded-xl">
            {type === 'flight' ? <Plane size={24} className="text-white" /> : <Ship size={24} className="text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-white">FlyFerry</h1>
        </div>
        <p className="text-sky-100 text-sm">Book flights & ferries across East Africa</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Type tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType('flight')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
              type === 'flight' ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' : 'bg-white text-slate-500'
            }`}
          >
            <Plane size={18} /> Flights
          </button>
          <button
            onClick={() => setType('ferry')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
              type === 'ferry' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-white text-slate-500'
            }`}
          >
            <Ship size={18} /> Ferries
          </button>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
          {/* Origin */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
              <MapPin size={12} /> From
            </label>
            <select
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-sky-400"
            >
              <option value="">Any departure point</option>
              {places.map(p => (
                <option key={p.code} value={p.code}>{p.city} ({p.code}) — {p.name}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
              <MapPin size={12} /> To
            </label>
            <select
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-sky-400"
            >
              <option value="">Any destination</option>
              {places.map(p => (
                <option key={p.code} value={p.code}>{p.city} ({p.code}) — {p.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
              <Calendar size={12} /> Date
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {dates.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDate(d.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    date === d.value ? 'bg-sky-600 text-white' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
              <Users size={12} /> Passengers
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 font-bold text-lg flex items-center justify-center"
              >−</button>
              <span className="text-lg font-semibold text-slate-700 w-8 text-center">{passengers}</span>
              <button
                onClick={() => setPassengers(Math.min(9, passengers + 1))}
                className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 font-bold text-lg flex items-center justify-center"
              >+</button>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!canSearch}
            className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-200 active:scale-[0.98] transition-transform"
          >
            Search {type === 'flight' ? 'Flights' : 'Ferries'} <ArrowRight size={18} />
          </button>
        </div>

        {/* Info note */}
        <div className="mt-4 bg-sky-50 rounded-xl p-3 flex gap-2 items-start">
          <span className="text-sky-500 text-sm">ℹ️</span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Card payment is simulated for this demo. Real payments can be enabled with Stripe integration.
          </p>
        </div>
      </div>
    </div>
  );
}
