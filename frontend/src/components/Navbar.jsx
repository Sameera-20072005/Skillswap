import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, Users, CalendarCheck, User, LogOut, Zap } from 'lucide-react';
import { api } from '../mock/api';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/matches',     label: 'Matches',     icon: Users },
  { to: '/sessions',    label: 'Sessions',    icon: CalendarCheck },
  { to: '/profile',     label: 'Profile',     icon: User },
];

function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    api.logout();
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <NavLink to="/dashboard" className="logo">
          <Zap size={22} />
          SkillSwap
        </NavLink>

        <div className="nav-links">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
