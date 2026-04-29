# Quick Start Guide

Get the Movie Tracker application running in 5 minutes!

## Prerequisites Check
- [ ] Node.js installed (https://nodejs.org)
- [ ] npm installed (comes with Node.js)
- [ ] Git (optional, for cloning)
- [ ] TMDB API Key (get free at https://www.themoviedb.org/settings/api)

---

## Step 1: Setup Backend (2 minutes)

Open terminal and navigate to the project:

```bash
cd e2e-project-app/backend
```

Install dependencies:
```bash
npm install
```

Start the backend server:
```bash
npm run dev
```

You should see:
```
DB ready
Server running on http://localhost:3000
```

✅ **Backend is ready!** Keep this terminal open.

---

## Step 2: Setup Frontend (2 minutes)

Open a **new terminal** window and navigate:

```bash
cd e2e-project-app/frontend
```

Install dependencies:
```bash
npm install
```

**Before starting**, get your TMDB API key and add it to the code:

1. Go to https://www.themoviedb.org/settings/api
2. Sign up or log in
3. Create/copy your API key
4. Open `src/App.jsx`
5. Find line with `const TMDB_KEY = "YOUR_TMDB_API_KEY_HERE"`
6. Replace with your actual key

Start the frontend:
```bash
npm run dev
```

You should see:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

✅ **Frontend is ready!**

---

## Step 3: Open Application (1 minute)

Click or open in browser:
```
http://localhost:5173
```

You should see the Movie Tracker login page.

✅ **Application is running!**

---

## First Steps in the App

### 1. Create Account
- Click "Create New Account"
- Enter any email and password (min 6 chars)
- Click the button

### 2. Search Movies
- Search for "Avatar" or any movie
- Click "Search"

### 3. Add to Your List
- Click "+ Add to List" on any movie
- Go to "My List" tab

### 4. Write a Review
- Click "+ Add Review"
- Write your thoughts
- Click "Save Review"

### 5. Mark as Favorite
- Click the empty star ☆
- It becomes filled ⭐

✅ **You've tested all features!**

---

## Troubleshooting

### Backend won't start
```
Error: listen EADDRINUSE :::3000
```
Solution: Port 3000 is in use. Kill the process:

**Windows (PowerShell)**:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux**:
```bash
lsof -ti:3000 | xargs kill -9
```

### Frontend won't connect to backend
Error in browser console: `Failed to fetch`

Solution:
1. Make sure backend is running (`npm run dev` in backend folder)
2. Check API URL in `App.jsx` line 4 is `http://localhost:3000`
3. Check backend terminal shows "Server running"

### Movies won't search / No results
Solution:
1. Verify TMDB API key in `App.jsx` line 5
2. Check it's a real API key (not the template text)
3. Check internet connection
4. Try searching for "Avatar" (popular movie)

### Can't login after registering
Solution:
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Check if `movieTrackerUser` is saved
4. Try closing and reopening browser tab

---

## Common Edits

### Change Backend Port
In `backend/server.js`, line 5:
```javascript
const PORT = 3000;  // Change to 3001, etc.
```

### Change Frontend Port
In `frontend/vite.config.js`, add:
```javascript
export default {
  server: {
    port: 3000,  // Change port here
  }
}
```

### Change API URL
In `frontend/src/App.jsx`, line 4:
```javascript
const API = "http://localhost:3000";  // Change if using different port
```

---

## Next Steps

1. **Review the code**:
   - [Backend API Docs](backend/API_DOCUMENTATION.md)
   - [Main README](README.md)
   - [Testing Guide](TESTING.md)

2. **Explore the features**:
   - Search and add movies
   - Write detailed reviews
   - Toggle favorites
   - Test validation errors
   - Try different search terms

3. **Optional enhancements**:
   - Add more features (watchlist, ratings, etc.)
   - Improve styling
   - Add dark/light theme toggle
   - Implement testing
   - Add pagination to search results

---

## Useful Commands

### Backend
```bash
cd backend
npm install       # Install dependencies
npm run dev      # Start server
npm start        # Alternative start
```

### Frontend
```bash
cd frontend
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Database
```bash
# From backend folder
sqlite3 database.sqlite   # Open database
.tables                   # List tables
SELECT * FROM users;      # View all users
SELECT * FROM movies;     # View all movies
.exit                     # Exit
```

---

## File Locations

Important files you might need to edit:

```
e2e-project-app/
├── backend/
│   └── server.js          ← Main backend code
│   └── db.js              ← Database setup
│   └── API_DOCUMENTATION.md
│   └── database.sqlite    ← Data storage
│
└── frontend/
    └── src/
        └── App.jsx        ← All frontend code (components, logic)
        └── styles.css     ← Styling
    └── package.json       ← Dependencies
    └── vite.config.js     ← Frontend config
    
├── README.md              ← Main documentation
└── TESTING.md             ← Test cases
```

---

## Success Checklist

- [x] Backend server is running
- [x] Frontend is running
- [x] Can see login page
- [x] Can register/login
- [x] Can search movies
- [x] Can add movies
- [x] Can write reviews
- [x] Can mark as favorite
- [x] Data persists

---

## Getting Help

1. **Check error messages** in browser console (F12)
2. **Check backend terminal** for errors
3. **Read the documentation** in [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
4. **Check TESTING.md** for known issues and solutions

---

## What's Next?

- Explore the code and understand how it works
- Modify features to your liking
- Add new functionality (ratings, watch status, etc.)
- Deploy to production (Vercel for frontend, Heroku for backend)
- Add more tests
- Optimize performance

Happy coding! 🚀
