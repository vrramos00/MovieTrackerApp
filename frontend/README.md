# Frontend - Movie Tracker

React-based frontend for the Movie Tracker application using Vite and TMDB API.

## Setup

### Installation

```bash
npm install
```

### Get TMDB API Key

1. Visit https://www.themoviedb.org/settings/api
2. Create a free account
3. Request an API key
4. Add to `App.jsx`:

```javascript
const TMDB_KEY = "YOUR_API_KEY_HERE";
```

### Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features

- User registration and login
- Movie search with TMDB API
- Save movies to personal list
- Mark movies as favorites
- Write and edit reviews
- Delete movies from list
- Responsive design
- Session persistence with localStorage

## Architecture

### Key Components
- **App.jsx** - Main component managing all state and logic
- **styles.css** - Global styling with responsive design

### State Management
- React hooks (useState, useEffect)
- localStorage for session persistence

### API Integration
- Fetch API for backend communication
- TMDB API for movie data
- Error handling and validation

## Environment

Set in `App.jsx`:
```javascript
const API = "http://localhost:3000";           // Backend URL
const TMDB_KEY = "YOUR_TMDB_API_KEY_HERE";   // TMDB API key
```

## Important Notes

⚠️ Make sure backend server is running before starting frontend:
```bash
# In another terminal
cd backend
npm run dev
```

## Troubleshooting

**Cannot find backend**
- Check backend is running on port 3000
- Check API URL in App.jsx

**TMDB API not working**
- Verify API key is correct
- Check internet connection
- API key might be invalid or expired

**Movies not saving**
- Check browser console for errors
- Verify backend is running
- Try clearing localStorage if session is corrupted
