import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react';
import { api } from '../mock/api';
import SkillCard from '../components/SkillCard';
import './Marketplace.css';

function Marketplace() {
  const [users, setUsers]               = useState([]);
  const [currentUser, setCurrentUser]   = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [levelFilter, setLevelFilter]   = useState('');
  const [campusFilter, setCampusFilter] = useState('');
  const [loading, setLoading]           = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadMarketplace(); }, []);

  const loadMarketplace = async () => {
    try {
      const [data, me] = await Promise.all([api.getAllUsers(), api.getCurrentUser()]);
      setCurrentUser(me);
      // Filter out current user from marketplace
      setUsers(data.filter(u => u.id?.toString() !== me?.id?.toString()));
    } catch {
      console.error('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(user => {
    const matchSearch = !searchQuery ||
      (user.skillsOffered || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel  = !levelFilter  || user.level  === levelFilter;
    const matchCampus = !campusFilter || user.campus === campusFilter;
    return matchSearch && matchLevel && matchCampus;
  });

  const allSkills   = [...new Set(users.flatMap(u => u.skillsOffered || []))];
  const allCampuses = [...new Set(users.map(u => u.campus).filter(Boolean))];
  const hasFilters  = searchQuery || levelFilter || campusFilter;

  const handleRequest = (user) => navigate('/exchange/new', { state: { targetUser: user } });

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="marketplace page-enter">
      <div className="container">
        <div className="marketplace-header">
          <div>
            <h1>Skill Marketplace</h1>
            <p>Discover skills and find your perfect learning partner</p>
          </div>
          <div className="marketplace-stats">
            <span><strong>{filtered.length}</strong> learners</span>
            <span className="dot">·</span>
            <span><strong>{allSkills.length}</strong> skills</span>
          </div>
        </div>

        {/* Filters */}
        <div className="marketplace-filters card">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search skills or people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}><X size={16} /></button>
            )}
          </div>
          <div className="filter-group">
            <div className="filter-icon"><SlidersHorizontal size={16} /></div>
            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Mentor">Mentor</option>
              <option value="Master">Master</option>
            </select>
            <select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value)}>
              <option value="">All Campuses</option>
              {allCampuses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {hasFilters && (
              <button className="btn btn-ghost" onClick={() => { setSearchQuery(''); setLevelFilter(''); setCampusFilter(''); }}>
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="marketplace-grid grid grid-3">
            {filtered.flatMap(user =>
              (user.skillsOffered || []).map((skill, idx) => (
                <SkillCard key={`${user.id}-${idx}`} user={user} skill={skill} onRequest={handleRequest} />
              ))
            )}
          </div>
        ) : (
          <div className="no-results card">
            <BookOpen size={48} className="no-results-icon" />
            <h3>{hasFilters ? 'No skills match your filters' : 'No skills available yet'}</h3>
            <p>{hasFilters ? 'Try adjusting your search or filters' : 'Check back soon as more users join'}</p>
            {hasFilters && (
              <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setLevelFilter(''); setCampusFilter(''); }}>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
