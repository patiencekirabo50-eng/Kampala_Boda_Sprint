const API = '/api';

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function searchTrips(params) {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${API}/trips?${qs}`).then(handle);
}

export function getTrip(id) {
  return fetch(`${API}/trips/${id}`).then(handle);
}

export function getTripStatus(id) {
  return fetch(`${API}/trips/${id}/status`).then(handle);
}

export function createBooking(data) {
  return fetch(`${API}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handle);
}

export function getBookings() {
  return fetch(`${API}/bookings`).then(handle);
}

export function getBooking(ref) {
  return fetch(`${API}/bookings/${ref}`).then(handle);
}

export function getAirports() {
  return fetch(`${API}/airports`).then(handle);
}

export function getPorts() {
  return fetch(`${API}/ports`).then(handle);
}
