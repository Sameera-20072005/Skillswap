import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Users, CalendarCheck, Star, Gem, TrendingUp, Pencil, Search } from 'lucide-react';
import { api } from '../mock/api';
import DashboardWidget from '../components/DashboardWidget';
import ExchangeCard from '../components/ExchangeCard';
import CreditBadge from '../components/CreditBadge';
import Toast from '../components/Toast';
import './Dashboard.css';

function Dashboard() {
  const [currentUser, setCurrentUser]   = useState(null);
  const [exchanges, setExchanges]       = useState([]);
  const [allUsers, setAllUsers]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [toast, setToast]               = useState(null);
  const navigate = useNavigate();

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [user, userExchanges, usersData] = await Promise.all([
        api.getCurrentUser(),
        api.getExchanges(),
        api.getAllUsers()
      ]);
      setCurrentUser(user);
      setExchanges(userExchanges);
      setAllUsers(usersData);
    } catch {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExchangeAction = async (action, exchangeId) => {
    if (action === 'feedback') { navigate(`/feedback/${exchangeId}`); return; }
    try {
      if (action === 'accept') {
        await api.acceptExchange(exchangeId);
        showToast('Exchange accepted! Session scheduled.');
      } else if (action === 'reject') {
        await api.rejectExchange(exchangeId);
        showToast('Exchange rejected.', 'info');
      } else if (action === 'complete') {
        const result = await api.completeSession(exchangeId);
        showToast(result.message || 'Session marked as completed!');
        const updatedUser = await api.getCurrentUser();
        setCurrentUser(updatedUser);
      }
      const updated = await api.getExchanges();
      setExchanges(updated);
    } catch {
      showToast('Action failed. Please try again.', 'error');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const activeExchanges    = exchanges.filter(e => ['accepted', 'scheduled'].includes(e.status));
  const pendingRequests    = exchanges.filter(e => e.status === 'pending');
  const completedExchanges = exchanges.filter(e => e.status === 'completed');

  const credits     = currentUser?.skillCredits || 0;
  const nextLevelAt = credits < 20 ? 20 : credits < 50 ? 50 : null;
  const progressPct = nextLevelAt ? Math.min((credits / nextLevelAt) * 100, 100) : 100;

  return (
    <div className="dashboard page-enter">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {currentUser?.name}!</h1>
            <p>Here's your skill exchange overview</p>
          </div>
          <CreditBadge credits={currentUser?.skillCredits} level={currentUser?.level} />
        </div>

        {/* Widgets */}
        <div className="grid grid-3">
          <DashboardWidget title="Skill Credits"      value={currentUser?.skillCredits} iconKey="credits"   color="primary"   />
          <DashboardWidget title="Upcoming Sessions"  value={activeExchanges.length}    iconKey="sessions"  color="secondary" />
          <DashboardWidget title="Completed Sessions" value={completedExchanges.length} iconKey="completed" color="accent"    />
        </div>

        {/* Reputation + Credit progress */}
        <div className="dashboard-grid">
          <div className="dashboard-section card reputation-card">
            <div className="rep-icon"><Star size={20} /></div>
            <h3>Reputation Score</h3>
            <div className="reputation-score">{currentUser?.rating?.toFixed(1) || '0.0'}</div>
            <div className="reputation-stars">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={18} fill={s <= Math.round(currentUser?.rating || 0) ? '#f59e0b' : 'none'} color={s <= Math.round(currentUser?.rating || 0) ? '#f59e0b' : '#cbd5e1'} />
              ))}
            </div>
            <p className="reputation-sub">Based on {currentUser?.reviewCount || 0} reviews</p>
          </div>

          <div className="dashboard-section card credit-progress-card">
            <div className="rep-icon"><TrendingUp size={20} /></div>
            <h3>Credit Progress</h3>
            <div className="credit-progress-info">
              <span className="credit-current">{credits} credits</span>
              {nextLevelAt
                ? <span className="credit-next">Next level at {nextLevelAt}</span>
                : <span className="credit-next">Max level reached!</span>}
            </div>
            <div className="credit-progress-bar">
              <div className="credit-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="credit-levels">
              <span className={credits < 20 ? 'level active' : 'level done'}>Beginner</span>
              <span className={credits >= 20 && credits < 50 ? 'level active' : credits >= 20 ? 'level done' : 'level'}>Mentor</span>
              <span className={credits >= 50 ? 'level active' : 'level'}>Master</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Skills You Offer</h2>
              <button className="btn btn-outline" onClick={() => navigate('/profile')}><Pencil size={14} /> Edit</button>
            </div>
            <div className="skill-tags-list">
              {(currentUser?.skillsOffered || []).map((skill, idx) => (
                <span key={idx} className="skill-tag-large">{skill}</span>
              ))}
              {!currentUser?.skillsOffered?.length && (
                <p className="empty-hint">No skills added yet. <button className="link-btn" onClick={() => navigate('/profile')}>Add skills</button></p>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Skills You Need</h2>
              <button className="btn btn-outline" onClick={() => navigate('/marketplace')}><Search size={14} /> Find</button>
            </div>
            <div className="skill-tags-list">
              {(currentUser?.skillsNeeded || []).map((skill, idx) => (
                <span key={idx} className="skill-tag-large secondary">{skill}</span>
              ))}
              {!currentUser?.skillsNeeded?.length && (
                <p className="empty-hint">No skills added yet. <button className="link-btn" onClick={() => navigate('/profile')}>Add skills</button></p>
              )}
            </div>
          </div>
        </div>

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div className="dashboard-section">
            <h2>Pending Requests <span className="count-badge">{pendingRequests.length}</span></h2>
            <div className="grid grid-2">
              {pendingRequests.map(exchange => (
                <ExchangeCard key={exchange.id} exchange={exchange} users={allUsers} currentUserId={currentUser?.id} onAction={handleExchangeAction} />
              ))}
            </div>
          </div>
        )}

        {/* Active sessions */}
        {activeExchanges.length > 0 && (
          <div className="dashboard-section">
            <h2>Upcoming Live Sessions <span className="count-badge">{activeExchanges.length}</span></h2>
            <div className="grid grid-2">
              {activeExchanges.map(exchange => (
                <ExchangeCard key={exchange.id} exchange={exchange} users={allUsers} currentUserId={currentUser?.id} onAction={handleExchangeAction} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested matches — no AI claim */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Suggested Matches</h2>
            <button className="btn btn-primary" onClick={() => navigate('/matches')}>View All</button>
          </div>
          <p className="section-subtitle">Recommended users based on your skills and learning goals</p>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          {[
            { icon: Store,        title: 'Browse Marketplace', desc: 'Find skills you want to learn',    path: '/marketplace' },
            { icon: Users,        title: 'View Matches',       desc: 'See your recommended matches',     path: '/matches'     },
            { icon: CalendarCheck,title: 'Track Sessions',     desc: 'Manage your exchange workflow',    path: '/sessions'    },
          ].map(({ icon: Icon, title, desc, path }) => (
            <button key={path} className="action-card card" onClick={() => navigate(path)}>
              <div className="action-icon"><Icon size={32} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
