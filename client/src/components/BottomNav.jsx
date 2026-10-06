import { NavLink } from 'react-router-dom';
import { Search, Ticket, Radar } from 'lucide-react';

const items = [
  { to: '/', label: 'Search', icon: Search, end: true },
  { to: '/bookings', label: 'Bookings', icon: Ticket },
  { to: '/track', label: 'Track', icon: Radar },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 flex z-50">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
              isActive ? 'text-sky-600' : 'text-slate-400'
            }`
          }
        >
          <Icon size={22} />
          <span className="text-xs font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
