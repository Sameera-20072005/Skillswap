import { Link, useNavigate } from 'react-router-dom';
import { Zap, Users, Star, ArrowRight, CheckCircle, BookOpen, Award } from 'lucide-react';
import './Landing.css';

function Landing({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="container nav-container">
          <div className="logo"><Zap size={22} /> SkillSwap</div>
          <div className="nav-actions">
            {isAuthenticated ? (
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Join Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">🎓 Peer-to-Peer Learning Platform</div>
          <h1>Exchange Skills.<br />Not Money.</h1>
          <p className="hero-subtitle">
            Join a community where knowledge is currency. Teach what you know, learn what you need — through structured live sessions.
          </p>
          <div className="hero-actions">
            <button className="btn btn-white btn-lg" onClick={handleGetStarted}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight size={18} />
            </button>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-outline-white btn-lg">Login</Link>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><strong>500+</strong><span>Active Learners</span></div>
            <div className="hero-stat"><strong>1,200+</strong><span>Sessions Completed</span></div>
            <div className="hero-stat"><strong>4.8★</strong><span>Avg. Rating</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="section-label">Why SkillSwap?</div>
          <h2>A smarter way to learn</h2>
          <div className="grid grid-3">
            {[
              { icon: BookOpen, title: 'Knowledge is Currency',    desc: 'Trade your skills for the skills you need. No money required — just mutual value.' },
              { icon: Users,    title: 'Trust-Based Community',    desc: 'Build reputation through ratings and successful exchanges with verified peers.' },
              { icon: Award,    title: 'Skill Credit System',      desc: 'Earn credits for every completed session. Level up from Beginner to Master.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card card">
                <div className="feature-icon"><Icon size={28} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-label">Simple Process</div>
          <h2>How It Works</h2>
          <div className="steps">
            {[
              { n: '01', title: 'Create Profile',   desc: 'List skills you offer and skills you want to learn' },
              { n: '02', title: 'Find Matches',      desc: 'Browse marketplace or get AI-powered match suggestions' },
              { n: '03', title: 'Exchange & Grow',   desc: 'Schedule live sessions, learn together, earn skill credits' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="step">
                <div className="step-number">{n}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session modes */}
      <section className="modes-section">
        <div className="container">
          <div className="section-label">Flexible Learning</div>
          <h2>Learn Your Way</h2>
          <div className="modes-grid">
            {[
              { icon: '🎥', label: 'Video Session',   desc: 'Face-to-face via Zoom or Meet' },
              { icon: '🎙️', label: 'Audio Only',      desc: 'Voice call — no camera needed' },
              { icon: '💬', label: 'Chat-Based',      desc: 'Text learning for privacy' },
              { icon: '🖥️', label: 'Screen Share',    desc: 'Perfect for coding & design' },
              { icon: '📍', label: 'In-Person',       desc: 'Meet on campus' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="mode-pill">
                <span className="mode-emoji">{icon}</span>
                <div>
                  <strong>{label}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-label">Community</div>
          <h2>What Students Say</h2>
          <div className="grid grid-2">
            {[
              { text: '"SkillSwap helped me learn UI/UX design while sharing my Python knowledge. The structured sessions are amazing!"', name: 'Alex Chen',      school: 'MIT Student',      img: 'https://i.pravatar.cc/150?img=1' },
              { text: '"I\'ve learned more through peer exchanges than traditional courses. The credit system keeps everyone motivated."', name: 'Sarah Martinez', school: 'Stanford Student', img: 'https://i.pravatar.cc/150?img=5' },
            ].map(({ text, name, school, img }) => (
              <div key={name} className="testimonial card">
                <div className="testimonial-stars">{'★'.repeat(5)}</div>
                <p>{text}</p>
                <div className="testimonial-author">
                  <img src={img} alt={name} />
                  <div><strong>{name}</strong><span>{school}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students exchanging skills every day</p>
          <button className="btn btn-white btn-lg" onClick={handleGetStarted}>
            {isAuthenticated ? 'Go to Dashboard' : 'Join SkillSwap Today'}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-logo"><Zap size={18} /> SkillSwap</div>
          <p>© 2024 SkillSwap. Empowering peer-to-peer learning.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
