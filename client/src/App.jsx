import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import SearchPage from './pages/SearchPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import TripDetailPage from './pages/TripDetailPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import TrackPage from './pages/TrackPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 max-w-md mx-auto relative shadow-xl">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/trip/:id" element={<TripDetailPage />} />
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route path="/confirmation/:ref" element={<ConfirmationPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/track" element={<TrackPage />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
