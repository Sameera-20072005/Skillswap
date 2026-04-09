# 🚀 Quick Start Guide

## Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
The app will automatically open at `http://localhost:3000`

## 🎯 First Time Using the App?

### Login Credentials (Mock)
- **Email**: Any email (e.g., `alex@skillswap.com`)
- **Password**: Any password

The app uses mock authentication, so any credentials will work!

## 📱 Navigation Guide

1. **Landing Page** (`/`) - Start here to see the platform overview
2. **Login** (`/login`) - Access the platform
3. **Dashboard** (`/dashboard`) - Your main hub after login
4. **Marketplace** (`/marketplace`) - Browse available skills
5. **Matches** (`/matches`) - See AI-powered suggestions
6. **Sessions** (`/sessions`) - Track your exchanges
7. **Profile** (`/profile`) - View your profile and reviews

## 🎨 Key Features to Try

### 1. Browse Marketplace
- Search for skills like "Python", "Design", "Java"
- Filter by level (Beginner/Mentor/Master)
- Filter by campus
- Click "Request Exchange" on any skill card

### 2. View AI Matches
- See compatibility percentages
- Check match reasons
- View compatibility factors
- Send exchange proposals

### 3. Track Sessions
- View exchange workflow timeline
- See status progression
- Leave feedback on completed exchanges

### 4. Explore Dashboard
- Check your skill credits (💎)
- View active exchanges
- See reputation score (⭐)
- Browse pending requests

## 💡 Mock Data Available

### Sample Users
1. **Alex Chen** - Python, Django, REST APIs
2. **Sarah Martinez** - UI/UX Design, Figma, Adobe XD
3. **James Wilson** - Java, Spring Boot, MySQL
4. **Emily Rodriguez** - Video Editing, Premiere Pro
5. **Michael Kim** - Graphic Design, Illustrator

### Sample Exchanges
- Various states: pending, accepted, scheduled, completed
- Different skill combinations
- Realistic messages and schedules

## 🎮 Try These Workflows

### Complete Exchange Flow
1. Login → Dashboard
2. Browse Marketplace
3. Find a skill you want
4. Request Exchange
5. Fill proposal form
6. Track in Sessions
7. Leave Feedback (for completed exchanges)

### Match Suggestion Flow
1. Login → Dashboard
2. Go to Matches
3. View compatibility scores
4. Read match reasons
5. Send proposal to high-match user

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── mock/           # Mock data and API
├── App.jsx         # Main app with routing
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Green (#10b981)
- **Accent**: Purple (#8b5cf6)

### Status Colors
- **Pending**: Yellow
- **Accepted**: Blue
- **Scheduled**: Purple
- **Completed**: Green
- **Cancelled**: Red

## 🔧 Troubleshooting

### Port Already in Use?
Edit `vite.config.js` and change the port:
```js
server: {
  port: 3001  // Change to any available port
}
```

### Dependencies Not Installing?
Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Page Not Loading?
- Check console for errors
- Ensure all dependencies are installed
- Try clearing browser cache

## 📚 Learn More

- Check `README.md` for full documentation
- See `IMPLEMENTATION.md` for implementation details
- Explore components in `src/components/`
- Review mock data in `src/mock/data.js`

## 🎯 What to Showcase

This project demonstrates:
- ✅ React functional components & hooks
- ✅ React Router navigation
- ✅ State management
- ✅ Component composition
- ✅ Responsive design
- ✅ Modern UI/UX patterns
- ✅ Mock API integration
- ✅ Form handling
- ✅ SaaS product design

## 🌟 Standout Features

1. **Circular Progress** - Custom SVG progress circles
2. **Timeline Tracker** - Visual workflow timeline
3. **AI Matching** - Compatibility scoring UI
4. **Gamification** - Credits, badges, levels
5. **Status System** - Color-coded workflow states

---

**Ready to explore? Run `npm run dev` and start learning!** 🚀

*"Exchange Skills. Not Money."*
