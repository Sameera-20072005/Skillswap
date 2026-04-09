# SkillSwap — Peer-to-Peer Skill Exchange Platform

SkillSwap is a modern, responsive frontend-only web application that simulates a peer-to-peer skill exchange platform where students exchange skills instead of money.

## 🎯 Project Overview

A SaaS-style platform featuring intelligent matching UI, marketplace-style layout, session tracking workflow, and a trust-based rating system. Built entirely with React and mock data - no backend required.

## 🌟 Core Features

### 1. **Landing Page**
- Hero section with "Exchange Skills. Not Money." tagline
- Feature highlights showcasing platform benefits
- How It Works section with 3-step visual flow
- Testimonials from mock users
- Call-to-action sections

### 2. **Authentication**
- Clean login and registration pages
- Form validation
- Student role-based access
- Mock authentication flow

### 3. **Dashboard**
- Skill Credits widget with gamification
- Active Exchanges counter
- Reputation Score display
- Skills offered and needed sections
- Pending requests management
- Active exchanges tracking
- AI match suggestions preview
- Quick action cards

### 4. **Profile Page**
- User avatar and bio
- Skills offered (tag-based UI)
- Skills needed
- Availability schedule
- Rating display with stars
- Reviews section
- Skill credits and level badges

### 5. **Skill Marketplace**
- Grid-based skill listing
- Search functionality
- Category and level filters
- Campus-based filtering
- Skill cards with:
  - User information
  - Rating display
  - Availability badge
  - Request Exchange button

### 6. **AI Match Suggestions**
- Intelligent matching algorithm simulation
- Match percentage with circular progress
- Compatibility factors display
- Reason for match explanation
- Send Exchange Proposal functionality

### 7. **Exchange Request**
- Detailed proposal form
- Skill selection (offer/request)
- Message input
- Preferred schedule picker
- User preview sidebar

### 8. **Session Tracker**
- Visual timeline workflow:
  - Request Sent → Accepted → Scheduled → Completed
- Horizontal progress tracker
- Status badges
- Step icons
- Exchange details display
- Feedback prompts

### 9. **Feedback & Rating**
- Interactive star rating system
- Text feedback form
- Rewards display (skill credits)
- Review submission

## 🎨 Design Features

### Modern SaaS UI
- Clean, minimal interface
- Soft shadows and rounded cards
- Light theme with blue/green accents
- Modern Inter typography
- Subtle animations and transitions
- Status badges with color coding
- Progress indicators
- Glassmorphism effects

### Gamification Elements
- **Skill Credits System**: Earn credits for exchanges
- **Badge Levels**: Beginner → Mentor → Master
- **Progress Bars**: Visual growth tracking
- **Reputation Score**: Numeric + star rating

### Status Indicators
- Pending (Yellow)
- Accepted (Blue)
- Scheduled (Purple)
- Completed (Green)
- Cancelled (Red)

## 📁 Project Structure

```
SkillSwap/
├── src/
│   ├── components/
│   │   ├── Badge.jsx
│   │   ├── DashboardWidget.jsx
│   │   ├── ExchangeCard.jsx
│   │   ├── MatchCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProgressCircle.jsx
│   │   ├── ProgressTracker.jsx
│   │   ├── RatingStars.jsx
│   │   └── SkillCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ExchangeRequest.jsx
│   │   ├── Feedback.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Marketplace.jsx
│   │   ├── MatchSuggestions.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── SessionTracker.jsx
│   ├── mock/
│   │   ├── api.js (Simulated API with delays)
│   │   └── data.js (Mock users, exchanges, reviews)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## 🛠️ Technology Stack

- **React 18** - UI library with functional components and hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client (for mock API)
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS Grid and Flexbox
- **Inter Font** - Modern typography

## 💡 Core Ideology

The platform reflects these principles in its design:

1. **Knowledge is Currency** - Skills are tradable assets
2. **Collaborative Growth** - Learning together over competition
3. **Equal Access** - No financial barriers
4. **Trust-Based Community** - Reputation and ratings matter
5. **Digital Skill Economy** - Modern peer-to-peer exchange

## 🎯 Key UI Innovations

### 1. Skill Credit System
- Visual credit counter
- Badge progression (Beginner → Mentor → Master)
- Progress bars for growth tracking

### 2. Match Percentage Visualization
- Circular progress component
- Compatibility score display
- AI-powered suggestion UI

### 3. Exchange Status Workflow
- Visual timeline with progress tracker
- Color-coded status badges
- Step-by-step completion indicators

### 4. Marketplace Design
- Trading platform aesthetic
- Filter and search functionality
- Grid-based skill cards

## 📊 Mock Data

The platform includes realistic mock data:

- **5 Sample Users** with diverse skills
- **Multiple Exchanges** in various states
- **Reviews and Ratings**
- **Match Suggestions** with compatibility scores
- **Skill Categories**: Python, UI/UX, Java, Video Editing, Graphic Design, etc.

## 🎨 Color Palette

```css
Primary: #3b82f6 (Blue)
Secondary: #10b981 (Green)
Accent: #8b5cf6 (Purple)
Background: #f8fafc
Card: #ffffff
Text: #1e293b
Text Light: #64748b
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px
- Flexible grid layouts
- Touch-friendly interactions

## 🔄 Simulated API

All API calls include realistic delays (500-1000ms) to simulate network requests:

- `api.login()` - User authentication
- `api.register()` - New user registration
- `api.getExchanges()` - Fetch user exchanges
- `api.createExchange()` - Create exchange request
- `api.submitReview()` - Submit feedback
- `api.getMatchSuggestions()` - Get AI matches
- `api.searchSkills()` - Search marketplace

## 🎓 Use Cases

1. **Student A** (Python Developer) wants to learn UI/UX Design
2. **Student B** (UI/UX Designer) wants to learn Python
3. They match, propose exchange, schedule sessions
4. Complete exchange and leave feedback
5. Earn skill credits and build reputation

## 🚀 Future Enhancements (Optional)

- Dark mode toggle
- Animated counters
- Notification system
- Toast messages
- Skill leaderboard
- Campus-based filtering
- JSON Server integration
- Tailwind CSS migration
- Real-time chat
- Calendar integration

## 📝 Notes

- **No backend required** - All data is mocked
- **Frontend-only** - Perfect for portfolio projects
- **Production-ready styling** - Modern SaaS design
- **Reusable components** - Clean architecture
- **Mock API delays** - Realistic UX simulation

## 🎯 Learning Outcomes

This project demonstrates:

- React functional components and hooks
- React Router for navigation
- State management with useState/useEffect
- Component composition and reusability
- CSS Grid and Flexbox layouts
- Responsive design principles
- Mock API integration
- Form handling and validation
- Modern UI/UX patterns
- SaaS product design

## 📄 License

This is a frontend demonstration project for educational purposes.

---

**Built with ❤️ for peer-to-peer learning**

*"Exchange Skills. Not Money."*
