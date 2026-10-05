import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { getTrip, createBooking } from '../lib/api.js';

function formatCardNumber(val) {
  return val.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [card, setCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    getTrip(id).then(data => { setTrip(data); setLoading(false); }).catch(() => setLoading(false));
    const pending = JSON.parse(localStorage.getItem('pendingBooking') || '{}');
    setPassengers(pending.passengers || []);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const booking = await createBooking({
        tripId: id,
        passengers,
        payment: {
          cardNumber: card.number,
          cardHolder: card.holder,
          expiry: card.expiry,
          cvv: card.cvv,
        },
      });
      localStorage.removeItem('pendingBooking');
      navigate(`/confirmation/${booking.ref}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  if (!trip) return <div className="min-h-screen flex items-center justify-center text-red-500">Trip not found</div>;

  const total = trip.price * (passengers.length || 1);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 px-4 pt-10 pb-6 rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sky-100 text-sm mb-3">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-xl font-bold text-white">Payment</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <h2 className="font-semibold text-slate-700 mb-3">Booking Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">{trip.operator} — {trip.number}</span>
              <span className="text-slate-600">{trip.origin} → {trip.destination}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{trip.date} · {trip.departureTime}</span>
              <span className="text-slate-600">{passengers.length} passenger{passengers.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
              <span className="font-semibold text-slate-600">Total</span>
              <span className="text-xl font-bold text-sky-600">${total}</span>
            </div>
          </div>
        </div>

        {/* Card form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <CreditCard size={18} /> Card Details
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">{error}</div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Card Number</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={card.number}
              onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium tracking-wider focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={card.holder}
              onChange={e => setCard({ ...card, holder: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">CVV</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                value={card.cvv}
                onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock size={12} /> Your payment is secured with SSL encryption
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sky-600 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-200 disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" /> Processing payment...</>
            ) : (
              <>Pay ${total}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
