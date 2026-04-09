import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import MatchSuggestions from './pages/MatchSuggestions';
import ExchangeRequest from './pages/ExchangeRequest';
import SessionTracker from './pages/SessionTracker';
import Feedback from './pages/Feedback';

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  const handleSetAuth = useCallback((val) => {
    setIsAuthenticated(val);
    if (!val) localStorage.removeItem('token');
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar onLogout={() => handleSetAuth(false)} />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing isAuthenticated={isAuthenticated} />} />
        <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login    setAuth={handleSetAuth} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register setAuth={handleSetAuth} />} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute isAuthenticated={isAuthenticated}><Dashboard /></PrivateRoute>} />
        <Route path="/profile"   element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>} />
        <Route path="/marketplace" element={<PrivateRoute isAuthenticated={isAuthenticated}><Marketplace /></PrivateRoute>} />
        <Route path="/matches"   element={<PrivateRoute isAuthenticated={isAuthenticated}><MatchSuggestions /></PrivateRoute>} />
        <Route path="/exchange/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><ExchangeRequest /></PrivateRoute>} />
        <Route path="/sessions"  element={<PrivateRoute isAuthenticated={isAuthenticated}><SessionTracker /></PrivateRoute>} />
        <Route path="/feedback/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><Feedback /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
