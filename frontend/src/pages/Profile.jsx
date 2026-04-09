import { useState, useEffect } from 'react';
import { api } from '../mock/api';
import { Calendar, Pencil } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import Badge from '../components/Badge';
import './Profile.css';

const CAMPUSES = ['MIT', 'Stanford', 'Berkeley', 'Harvard'];
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Mornings', 'Evenings', 'Flexible'];

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput('');
  };

  const remove = (item) => onChange(values.filter((v) => v !== item));

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="tag-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
        />
        <button type="button" className="btn btn-outline tag-add-btn" onClick={add}>Add</button>
      </div>
      <div className="tag-list">
        {values.map((v, i) => (
          <span key={i} className="tag-chip">
            {v} <button type="button" onClick={() => remove(v)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const userData = await api.getCurrentUser();
      const reviewsData = await api.getReviews(userData.id);
      setUser(userData);
      setUserReviews(reviewsData || []);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = () => {
    setForm({
      bio: user.bio || '',
      avatar: user.avatar || '',
      skillsOffered: [...(user.skillsOffered || [])],
      skillsNeeded: [...(user.skillsNeeded || [])],
      availability: [...(user.availability || [])],
    });
    setAvatarPreview(user.avatar || '');
    setEditing(true);
  };

  const handleField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleAvailability = (slot) => {
    const curr = form.availability || [];
    handleField('availability', curr.includes(slot) ? curr.filter((s) => s !== slot) : [...curr, slot]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Only send editable fields — name/campus/email are locked
      const result = await api.updateProfile(user.id, {
        bio: form.bio,
        avatar: form.avatar,
        skillsOffered: form.skillsOffered,
        skillsNeeded: form.skillsNeeded,
        availability: form.availability,
      });
      if (result.success) {
        setUser(result.user);
        setEditing(false);
      } else {
        alert('Failed to save changes.');
      }
    } catch {
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="loading">Could not load profile.</div>;

  const avatarSrc = user.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

  return (
    <div className="profile-page">
      <div className="container">

        {/* ── VIEW MODE ── */}
        {!editing && (
          <>
            <div className="profile-header card">
              <img src={avatarSrc} alt={user.name} className="profile-avatar" />
              <div className="profile-info">
                <div className="profile-name-section">
                  <h1>{user.name}</h1>
                  <Badge status="completed">{user.level}</Badge>
                  <button className="btn btn-primary edit-btn" onClick={startEdit}>Edit Profile</button>
                </div>
                <p className="profile-bio">{user.bio || 'No bio yet.'}</p>
                <div className="profile-stats">
                  <div className="stat"><div className="stat-value">{user.skillCredits}</div><div className="stat-label">Skill Credits</div></div>
                  <div className="stat"><div className="stat-value">{user.rating?.toFixed(1)}</div><div className="stat-label">Rating</div></div>
                  <div className="stat"><div className="stat-value">{user.reviewCount}</div><div className="stat-label">Reviews</div></div>
                  <div className="stat"><div className="stat-value">{user.campus || '—'}</div><div className="stat-label">Campus</div></div>
                </div>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-section card">
                <h2>Skills I Offer</h2>
                <div className="skill-tags-list">
                  {user.skillsOffered?.length ? user.skillsOffered.map((s, i) => (
                    <span key={i} className="skill-tag-large">{s}</span>
                  )) : <p className="muted">None added yet.</p>}
                </div>
              </div>
              <div className="profile-section card">
                <h2>Skills I Need</h2>
                <div className="skill-tags-list">
                  {user.skillsNeeded?.length ? user.skillsNeeded.map((s, i) => (
                    <span key={i} className="skill-tag-large secondary">{s}</span>
                  )) : <p className="muted">None added yet.</p>}
                </div>
              </div>
            </div>

            <div className="profile-section card">
              <h2>Availability</h2>
              <div className="availability-list">
                {user.availability?.length ? user.availability.map((slot, i) => (
                  <div key={i} className="availability-slot"><Calendar size={13} /> {slot}</div>
                )) : <p className="muted">No availability set.</p>}
              </div>
            </div>

            <div className="profile-section card">
              <h2>Reviews & Ratings</h2>
              <div className="reviews-summary">
                <div className="rating-display">
                  <div className="rating-number">{user.rating?.toFixed(1)}</div>
                  <RatingStars rating={user.rating} size={24} />
                  <div className="rating-count">Based on {user.reviewCount} reviews</div>
                </div>
              </div>
              <div className="reviews-list">
                {userReviews.length > 0 ? userReviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <RatingStars rating={review.rating} />
                      <span className="review-date">{review.createdAt}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                )) : <p className="no-reviews">No reviews yet. Complete exchanges to receive feedback!</p>}
              </div>
            </div>
          </>
        )}

        {/* ── EDIT MODE ── */}
        {editing && (
          <form className="edit-form card" onSubmit={handleSave}>
            <div className="edit-form-header">
              <h2>Edit Profile</h2>
              <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
            </div>

            {/* Edit form — locked fields shown as read-only */}
            <div className="avatar-edit-section">
              <img
                src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                alt="avatar preview"
                className="profile-avatar"
                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`; }}
              />
              <div className="avatar-url-input">
                <label>Avatar URL</label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => { handleField('avatar', e.target.value); setAvatarPreview(e.target.value); }}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="hint">Paste any image URL, or leave blank for auto-generated avatar.</p>
              </div>
            </div>

            {/* Locked fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Full Name <span className="locked-label">locked</span></label>
                <input value={user.name} disabled className="input-locked" />
              </div>
              <div className="form-group">
                <label>University / Campus <span className="locked-label">locked</span></label>
                <input value={user.campus || '—'} disabled className="input-locked" />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => handleField('bio', e.target.value)}
                placeholder="Tell others about yourself..."
              />
            </div>

            <TagInput
              label="Skills I Offer"
              values={form.skillsOffered}
              onChange={(v) => handleField('skillsOffered', v)}
              placeholder="e.g. React, Python… press Enter"
            />

            <TagInput
              label="Skills I Need"
              values={form.skillsNeeded}
              onChange={(v) => handleField('skillsNeeded', v)}
              placeholder="e.g. Figma, AWS… press Enter"
            />

            <div className="form-group">
              <label>Availability</label>
              <div className="availability-toggles">
                {AVAILABILITY_OPTIONS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={`avail-toggle ${form.availability?.includes(slot) ? 'active' : ''}`}
                    onClick={() => toggleAvailability(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="edit-form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

export default Profile;
