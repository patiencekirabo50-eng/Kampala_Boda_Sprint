import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Ship, Clock, ArrowLeft, User, Plus, Trash2, ArrowRight } from 'lucide-react';
import { getTrip } from '../lib/api.js';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', email: '', phone: '' }]);

  useEffect(() => {
    getTrip(id)
      .then(data => { setTrip(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  const updatePassenger = (i, field, value) => {
    setPassengers(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const addPassenger = () => {
    setPassengers(prev => [...prev, { name: '', email: '', phone: '' }]);
  };

  const removePassenger = (i) => {
    setPassengers(prev => prev.filter((_, idx) => idx !== i));
  };

  const allValid = passengers.every(p => p.name.trim() && p.email.trim());

  const handleContinue = () => {
    localStorage.setItem('pendingBooking', JSON.stringify({ tripId: id, passengers }));
    navigate(`/payment/${id}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!trip) return null;

  const total = trip.price * passengers.length;

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 px-4 pt-10 pb-6 rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sky-100 text-sm mb-3">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-xl font-bold text-white">Trip Details</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Trip card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${trip.type === 'flight' ? 'bg-sky-100' : 'bg-teal-100'}`}>
              {trip.type === 'flight' ? <Plane size={18} className="text-sky-600" /> : <Ship size={18} className="text-teal-600" />}
            </div>
            <div>
              <p className="font-semibold text-slate-700">{trip.operator}</p>
              <p className="text-xs text-slate-400">{trip.number} · {trip.class}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-slate-700">{trip.departureTime}</p>
              <p className="text-xs text-slate-400">{trip.originPlace?.city}</p>
              <p className="text-xs text-slate-300">{trip.originPlace?.name}</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={11} /> {trip.duration}</p>
              <div className="w-full flex items-center mt-1">
                <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                <div className="flex-1 h-0.5 bg-slate-200"></div>
                <div className="w-2 h-2 rounded-full bg-sky-400"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{trip.stops === 0 ? 'Direct' : `${trip.stops} stop`}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-slate-700">{trip.arrivalTime}</p>
              <p className="text-xs text-slate-400">{trip.destinationPlace?.city}</p>
              <p className="text-xs text-slate-300">{trip.destinationPlace?.name}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div>
              <p className="text-xs text-slate-400">Date</p>
              <p className="text-sm font-medium text-slate-600">{trip.date}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Price per person</p>
              <p className="text-lg font-bold text-sky-600">${trip.price}</p>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <User size={18} /> Passenger Details
            </h2>
            {passengers.length > 1 && (
              <span className="text-sm text-slate-400">{passengers.length} passengers</span>
            )}
          </div>

          <div className="space-y-3">
            {passengers.map((p, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-3 space-y-2 relative">
                {passengers.length > 1 && (
                  <button
                    onClick={() => removePassenger(i)}
                    className="absolute top-2 right-2 text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <p className="text-xs font-semibold text-slate-400">Passenger {i + 1}</p>
                <input
                  type="text"
                  placeholder="Full name"
                  value={p.name}
                  onChange={e => updatePassenger(i, 'name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={p.email}
                  onChange={e => updatePassenger(i, 'email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={p.phone}
                  onChange={e => updatePassenger(i, 'phone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            ))}
          </div>

          {passengers.length < 9 && (
            <button
              onClick={addPassenger}
              className="w-full mt-3 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 font-medium flex items-center justify-center gap-1"
            >
              <Plus size={16} /> Add passenger
            </button>
          )}
        </div>

        {/* Total + continue */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">{passengers.length} × ${trip.price}</span>
            <span className="text-2xl font-bold text-slate-700">${total}</span>
          </div>
          <button
            onClick={handleContinue}
            disabled={!allValid}
            className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-200 disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            Continue to Payment <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
