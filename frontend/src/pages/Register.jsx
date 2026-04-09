import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, UserPlus, Zap } from 'lucide-react';
import { api } from '../mock/api';
import './Auth.css';

const UNIVERSITIES = [
  'MIT', 'Stanford', 'Berkeley', 'Harvard', 'Caltech',
  'Carnegie Mellon', 'Princeton', 'Yale', 'Columbia', 'Cornell',
  'Oxford', 'Cambridge', 'IIT Bombay', 'IIT Delhi', 'NUS Singapore',
];

function Register({ setAuth }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', campus: '' });
  const [customCampus, setCustomCampus] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const isOther = formData.campus === 'other';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const campus = isOther ? customCampus.trim() : formData.campus;
    if (!campus) { setError('Please enter your university/college name.'); return; }

    setLoading(true);
    try {
      const result = await api.register({ ...formData, campus });
      if (result.success) {
        setAuth(true);
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        <div className="auth-brand">
          <Zap size={28} />
          <span>SkillSwap</span>
        </div>

        <div className="auth-card card">
          <h1>Join SkillSwap</h1>
          <p className="auth-subtitle">Start exchanging skills today</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <User size={16} className="input-icon" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" minLength={6} required />
              </div>
            </div>

            <div className="form-group">
              <label>University / College</label>
              <div className="input-icon-wrap">
                <Building size={16} className="input-icon" />
                <select name="campus" value={formData.campus} onChange={handleChange} required>
                  <option value="">Select your institution</option>
                  {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                  <option value="other">Other (enter manually)</option>
                </select>
              </div>
            </div>

            {isOther && (
              <div className="form-group">
                <label>Enter your University / College name</label>
                <div className="input-icon-wrap">
                  <Building size={16} className="input-icon" />
                  <input
                    type="text"
                    value={customCampus}
                    onChange={(e) => setCustomCampus(e.target.value)}
                    placeholder="e.g. University of Toronto"
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : <UserPlus size={16} />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
