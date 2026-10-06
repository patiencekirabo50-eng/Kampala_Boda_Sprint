import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// ─── Seed Data ───────────────────────────────────────────────

const airports = [
  { code: 'EBB', city: 'Entebbe', name: 'Entebbe International' },
  { code: 'NBO', city: 'Nairobi', name: 'Jomo Kenyatta Intl' },
  { code: 'DAR', city: 'Dar es Salaam', name: 'Julius Nyerere Intl' },
  { code: 'KGL', city: 'Kigali', name: 'Kigali Intl' },
  { code: 'JNB', city: 'Johannesburg', name: 'O.R. Tambo Intl' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport' },
  { code: 'ADD', city: 'Addis Ababa', name: 'Bole Intl' },
];

const ports = [
  { code: 'PBL', city: 'Port Bell', name: 'Port Bell, Entebbe' },
  { code: 'KSM', city: 'Kisumu', name: 'Kisumu Port' },
  { code: 'MWZ', city: 'Mwanza', name: 'Mwanza Port' },
  { code: 'BKZ', city: 'Bukoba', name: 'Bukoba Port' },
  { code: 'JIN', city: 'Jinja', name: 'Jinja Port' },
];

function pad(n) { return String(n).padStart(2, '0'); }

function dateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const tripDefs = [
  // Flights from EBB
  { type: 'flight', operator: 'Uganda Airlines', number: 'UR810', origin: 'EBB', destination: 'NBO', dep: '08:00', arr: '10:30', price: 320, seats: 45, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'Kenya Airways', number: 'KQ410', origin: 'EBB', destination: 'NBO', dep: '14:20', arr: '16:45', price: 340, seats: 30, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'Uganda Airlines', number: 'UR820', origin: 'EBB', destination: 'DAR', dep: '09:15', arr: '12:05', price: 280, seats: 38, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'Air Tanzania', number: 'TC401', origin: 'EBB', destination: 'DAR', dep: '17:30', arr: '20:10', price: 260, seats: 25, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'RwandAir', number: 'WB410', origin: 'EBB', destination: 'KGL', dep: '11:00', arr: '11:50', price: 190, seats: 22, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'RwandAir', number: 'WB414', origin: 'EBB', destination: 'KGL', dep: '19:40', arr: '20:30', price: 175, seats: 18, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'Ethiopian Airlines', number: 'ET332', origin: 'EBB', destination: 'ADD', dep: '06:30', arr: '08:40', price: 210, seats: 50, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'South African Airways', number: 'SA160', origin: 'EBB', destination: 'JNB', dep: '13:10', arr: '17:20', price: 450, seats: 28, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'Emirates', number: 'EK730', origin: 'EBB', destination: 'DXB', dep: '01:15', arr: '08:30', price: 680, seats: 35, stops: 1, cls: 'Economy' },
  { type: 'flight', operator: 'Turkish Airlines', number: 'TK610', origin: 'EBB', destination: 'IST', dep: '23:50', arr: '07:20', price: 720, seats: 32, stops: 1, cls: 'Economy' },
  // Reverse flights
  { type: 'flight', operator: 'Kenya Airways', number: 'KQ411', origin: 'NBO', destination: 'EBB', dep: '07:00', arr: '09:25', price: 330, seats: 30, stops: 0, cls: 'Economy' },
  { type: 'flight', operator: 'RwandAir', number: 'WB411', origin: 'KGL', destination: 'EBB', dep: '12:30', arr: '13:20', price: 185, seats: 22, stops: 0, cls: 'Economy' },
  // Ferries on Lake Victoria
  { type: 'ferry', operator: 'Lake Victoria Ferries', number: 'LVF-01', origin: 'PBL', destination: 'KSM', dep: '06:00', arr: '14:00', price: 45, seats: 120, stops: 0, cls: 'Standard' },
  { type: 'ferry', operator: 'MV Kalangala Express', number: 'LVF-02', origin: 'PBL', destination: 'KSM', dep: '09:30', arr: '17:30', price: 50, seats: 80, stops: 0, cls: 'Standard' },
  { type: 'ferry', operator: 'Lake Victoria Ferries', number: 'LVF-03', origin: 'PBL', destination: 'MWZ', dep: '05:00', arr: '18:00', price: 65, seats: 100, stops: 1, cls: 'Standard' },
  { type: 'ferry', operator: 'MV Victoria Star', number: 'LVF-04', origin: 'PBL', destination: 'MWZ', dep: '08:00', arr: '20:00', price: 70, seats: 90, stops: 1, cls: 'Premium' },
  { type: 'ferry', operator: 'Lake Victoria Ferries', number: 'LVF-05', origin: 'BKZ', destination: 'MWZ', dep: '07:00', arr: '13:00', price: 55, seats: 60, stops: 0, cls: 'Standard' },
  { type: 'ferry', operator: 'MV Kalangala Express', number: 'LVF-06', origin: 'PBL', destination: 'JIN', dep: '10:00', arr: '12:30', price: 25, seats: 50, stops: 0, cls: 'Standard' },
];

function calcDuration(dep, arr) {
  const [dh, dm] = dep.split(':').map(Number);
  const [ah, am] = arr.split(':').map(Number);
  let mins = (ah * 60 + am) - (dh * 60 + dm);
  if (mins < 0) mins += 24 * 60; // overnight
  return `${Math.floor(mins / 60)}h ${pad(mins % 60)}m`;
}

const trips = [];
let tripId = 1;
for (const def of tripDefs) {
  for (const dayOffset of [0, 1, 2, 3, 5, 7]) {
    const date = dateOffset(dayOffset);
    trips.push({
      id: `T${String(tripId++).padStart(4, '0')}`,
      type: def.type,
      operator: def.operator,
      number: def.number,
      origin: def.origin,
      destination: def.destination,
      date,
      departureTime: def.dep,
      arrivalTime: def.arr,
      duration: calcDuration(def.dep, def.arr),
      price: def.price,
      currency: 'USD',
      seats: def.seats,
      stops: def.stops,
      class: def.cls,
    });
  }
}

const bookings = [];

// ─── Helpers ─────────────────────────────────────────────────

function luhnValid(num) {
  const digits = num.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function genRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = '';
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

function getPlace(code) {
  return airports.find(a => a.code === code) || ports.find(p => p.code === code);
}

function computeStatus(trip) {
  const now = new Date();
  const dep = new Date(`${trip.date}T${trip.departureTime}:00`);
  const arr = new Date(`${trip.date}T${trip.arrivalTime}:00`);
  if (arr < now) return { status: 'arrived', label: 'Arrived', color: 'green' };
  if (dep < now) return { status: 'departed', label: 'Departed', color: 'blue' };
  const minsToDep = (dep - now) / 60000;
  if (minsToDep < 30) return { status: 'boarding', label: 'Boarding Now', color: 'amber' };
  if (minsToDep < 120) return { status: 'checkin', label: 'Check-in Open', color: 'teal' };
  return { status: 'scheduled', label: 'Scheduled', color: 'slate' };
}

// ─── Routes ──────────────────────────────────────────────────

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/airports', (req, res) => res.json(airports));
app.get('/api/ports', (req, res) => res.json(ports));

app.get('/api/trips', (req, res) => {
  const { type, origin, destination, date } = req.query;
  let results = trips;
  if (type) results = results.filter(t => t.type === type);
  if (origin) results = results.filter(t => t.origin === origin);
  if (destination) results = results.filter(t => t.destination === destination);
  if (date) results = results.filter(t => t.date === date);
  res.json(results);
});

app.get('/api/trips/:id', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json({ ...trip, originPlace: getPlace(trip.origin), destinationPlace: getPlace(trip.destination) });
});

app.get('/api/trips/:id/status', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json({ tripId: trip.id, number: trip.number, ...computeStatus(trip) });
});

app.post('/api/bookings', (req, res) => {
  const { tripId, passengers, payment } = req.body;
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (!passengers || !passengers.length) return res.status(400).json({ error: 'At least one passenger required' });

  // Validate card
  if (!payment || !payment.cardNumber) return res.status(400).json({ error: 'Payment required' });
  if (!luhnValid(payment.cardNumber)) return res.status(400).json({ error: 'Invalid card number' });

  const expiry = payment.expiry || '';
  const [em, ey] = expiry.split('/');
  if (!em || !ey) return res.status(400).json({ error: 'Invalid expiry date' });
  const expDate = new Date(`20${ey}-${em}-01`);
  if (expDate < new Date()) return res.status(400).json({ error: 'Card has expired' });

  if (!payment.cvv || !/^\d{3,4}$/.test(payment.cvv)) return res.status(400).json({ error: 'Invalid CVV' });

  const ref = genRef();
  const cardLast4 = payment.cardNumber.replace(/\s/g, '').slice(-4);
  const booking = {
    ref,
    tripId,
    tripNumber: trip.number,
    type: trip.type,
    operator: trip.operator,
    origin: trip.origin,
    destination: trip.destination,
    date: trip.date,
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    passengers,
    totalAmount: trip.price * passengers.length,
    currency: trip.currency,
    paymentStatus: 'paid',
    cardLast4,
    cardHolder: payment.cardHolder || '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/api/bookings', (req, res) => res.json(bookings));

app.get('/api/bookings/:ref', (req, res) => {
  const booking = bookings.find(b => b.ref === req.params.ref.toUpperCase());
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  const trip = trips.find(t => t.id === booking.tripId);
  res.json({ ...booking, liveStatus: trip ? computeStatus(trip) : null });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
