import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

// Axios instance — attaches JWT token automatically
const http = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    const { data } = await http.post('/auth/login', { email, password });
    if (data.token) localStorage.setItem('token', data.token);
    return data; // { success, token, user }
  },

  register: async (userData) => {
    const { data } = await http.post('/auth/register', userData);
    if (data.token) localStorage.setItem('token', data.token);
    return data; // { success, token, user }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  // ─── Users ───────────────────────────────────────────────────────────────
  getCurrentUser: async () => {
    const { data } = await http.get('/auth/profile');
    return data.user;
  },

  getUser: async (id) => {
    const { data } = await http.get(`/users/${id}`);
    return data.user;
  },

  getAllUsers: async () => {
    const { data } = await http.get('/users');
    return data.users;
  },

  updateProfile: async (userId, updates) => {
    const { data } = await http.put('/users/profile', updates);
    return data; // { success, user }
  },

  // ─── Exchanges ───────────────────────────────────────────────────────────
  // Used by Dashboard and SessionTracker: api.getExchanges(user.id)
  getExchanges: async (userId) => {
    const { data } = await http.get('/exchange/all');
    return data.exchanges;
  },

  createExchange: async (exchangeData) => {
    const { data } = await http.post('/exchange/request', exchangeData);
    return data.exchange;
  },

  acceptExchange: async (exchangeId, meetingLink) => {
    const { data } = await http.put(`/exchange/accept/${exchangeId}`, { meetingLink });
    return data; // { success, exchange }
  },

  rejectExchange: async (exchangeId) => {
    const { data } = await http.put(`/exchange/reject/${exchangeId}`);
    return data;
  },

  completeSession: async (exchangeId) => {
    const { data } = await http.put(`/exchange/complete/${exchangeId}`);
    return data; // { success, exchange, message }
  },

  updateMeetingLink: async (exchangeId, meetingLink) => {
    const { data } = await http.put(`/exchange/${exchangeId}/meeting-link`, { meetingLink });
    return data;
  },

  updateExchangeStatus: async (exchangeId, status) => {
    if (status === 'accepted') return api.acceptExchange(exchangeId);
    if (status === 'rejected') return api.rejectExchange(exchangeId);
    if (status === 'completed') return api.completeSession(exchangeId);
    return { success: false };
  },

  // ─── Feedback / Reviews ──────────────────────────────────────────────────
  // Used by Profile: api.getReviews(userId)
  getReviews: async (userId) => {
    const { data } = await http.get(`/feedback/${userId}`);
    return data.reviews;
  },

  // Used by Feedback page: api.submitReview({ exchangeId, rating, comment })
  submitReview: async (reviewData) => {
    const { data } = await http.post('/feedback', reviewData);
    return data; // { success, review, message }
  },

  // ─── Match Suggestions (computed client-side from real users) ─────────────
  getMatchSuggestions: async (userId) => {
    const { data } = await http.get('/users');
    const allUsers = data.users;
    const me = await api.getCurrentUser();

    return allUsers
      .filter((u) => u.id.toString() !== me.id.toString())
      .map((u) => {
        const skillMatch = u.skillsOffered.some((s) => me.skillsNeeded.includes(s));
        const reverseMatch = u.skillsNeeded.some((s) => me.skillsOffered.includes(s));
        const matchPercentage = skillMatch && reverseMatch ? 90 : skillMatch || reverseMatch ? 70 : 50;
        return {
          userId: u.id,
          matchPercentage,
          reason: skillMatch
            ? `${u.name} offers ${u.skillsOffered.find((s) => me.skillsNeeded.includes(s))} which you need`
            : `${u.name} is looking for skills you can teach`,
          compatibilityFactors: [
            ...(skillMatch ? ['Skill Match'] : []),
            ...(reverseMatch ? ['Complementary Goals'] : []),
            ...(u.rating >= 4.5 ? ['High Rating'] : []),
          ],
          user: u
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
  },

  // ─── Marketplace ─────────────────────────────────────────────────────────
  searchSkills: async (query, filters = {}) => {
    const params = {};
    if (query) params.search = query;
    if (filters.level) params.level = filters.level;
    if (filters.campus) params.campus = filters.campus;
    const { data } = await http.get('/users', { params });
    return data.users;
  }
};
