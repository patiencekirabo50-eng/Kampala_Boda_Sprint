import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Plane, Ship, Download, Home } from 'lucide-react';
import { getBooking } from '../lib/api.js';

export default function ConfirmationPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooking(ref)
      .then(data => { setBooking(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [ref]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-br from-green-500 to-green-600 px-4 pt-14 pb-8 rounded-b-3xl text-center">
        <div className="bg-white/20 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3">
          <CheckCircle size={36} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Booking Confirmed!</h1>
        <p className="text-green-50 text-sm mt-1">Your payment was successful</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Ticket card */}
        {booking && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className={`px-4 py-3 ${booking.type === 'flight' ? 'bg-sky-50' : 'bg-teal-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {booking.type === 'flight' ? <Plane size={18} className="text-sky-600" /> : <Ship size={18} className="text-teal-600" />}
                  <span className="font-semibold text-slate-700">{booking.operator}</span>
                </div>
                <span className="text-xs text-slate-400">{booking.tripNumber}</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Ref */}
              <div className="text-center border-b border-dashed border-slate-200 pb-3">
                <p className="text-xs text-slate-400 uppercase">Booking Reference</p>
                <p className="text-2xl font-bold tracking-widest text-sky-600">{booking.ref}</p>
              </div>

              {/* Route */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-700">{booking.origin}</p>
                  <p className="text-xs text-slate-400">{booking.departureTime}</p>
                </div>
                <div className="flex-1 mx-3 border-t border-dashed border-slate-300 relative">
                  <span className="absolute left-1/2 -top-1.5 -translate-x-1/2 text-slate-300">→</span>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-700">{booking.destination}</p>
                  <p className="text-xs text-slate-400">{booking.arrivalTime}</p>
                </div>
              </div>

              <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="font-medium text-slate-600">{booking.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Paid</p>
                  <p className="font-bold text-sky-600">${booking.totalAmount}</p>
                </div>
              </div>

              {/* Passengers */}
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400 mb-2">Passengers</p>
                <div className="space-y-1">
                  {booking.passengers.map((p, i) => (
                    <p key={i} className="text-sm font-medium text-slate-600">{p.name}</p>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
                <span className="text-slate-400">Paid with card</span>
                <span className="font-medium text-slate-600">•••• {booking.cardLast4}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => navigate('/bookings')}
            className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Download size={16} /> View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Home size={16} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
