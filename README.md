# 🎬 Movie Tracker - Full-Stack Application

A complete end-to-end web application for users to discover movies, save their favorites, and write reviews. Built with React (frontend) and Node.js/Express (backend) with SQLite database.

## Features

✅ **User Authentication**
- User registration with validation
- User login
- Session persistence with localStorage
- Logout functionality

✅ **Movie Discovery**
- Search movies using The Movie Database (TMDB) API
- Browse movie details (title, release date, ratings, poster images)
- Add movies to personal list

✅ **Movie Management**
- View saved movies in personal list
- Mark movies as favorites (toggle ⭐)
- Mark movies as watched, including watched date
- Remove movies from list
- Write and edit movie reviews
- Persistent storage in database

✅ **User Experience**
- Modern, responsive UI with dark theme
- Real-time validation with helpful error messages
- Loading states for all async operations
- Tab-based interface for navigation
- Beautiful movie cards with poster images

✅ **Code Quality**
- Organized architecture (separation of concerns)
- Backend validation and error handling
- Frontend form validation
- Proper HTTP status codes
- Comprehensive API documentation

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients and animations
- **The Movie Database (TMDB) API** - Movie data source

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin resource sharing

### Development
- **npm** - Package manager
- **Git** - Version control

---

## Project Structure

```
e2e-project-app/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── db.js                     # Database initialization
│   ├── database.sqlite           # SQLite database (auto-created)
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   └── API_DOCUMENTATION.md      # Detailed API docs
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Main React component
    │   ├── main.jsx              # React entry point
    │   └── styles.css            # Global styles
    ├── index.html                # HTML template
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite configuration
    └── README.md                 # Frontend setup guide
```

---

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **TMDB API Key** (free account at https://www.themoviedb.org)

### Installation & Setup

#### 1. Clone or Extract Project
```bash
cd e2e-project-app
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# (Optional) Create .env file from example
# cp .env.example .env

# Start the server
npm run dev
# Server runs on http://localhost:3000
```

#### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

#### 4. Get TMDB API Key

1. Go to https://www.themoviedb.org/settings/api
2. Create a free account
3. Request an API key
4. Copy the API key
5. In `frontend/src/App.jsx`, replace `YOUR_TMDB_API_KEY_HERE` with your actual key

```javascript
const TMDB_KEY = "your_api_key_here";
```

#### 5. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

---

## Usage Guide

### First Time User

1. **Register Account**
   - Click "Create New Account"
   - Enter email and password (min. 6 characters)
   - Click submit

2. **Login**
   - Enter your credentials
   - Click "Login"

3. **Search Movies**
   - Go to "Search Movies" tab
   - Enter movie title
   - Click "Search"
   - Click "+ Add to List" to save a movie

4. **Manage Your List**
   - Go to "My List" tab
   - View all saved movies
   - Click ⭐ to mark as favorite
   - Click "+ Add Review" to write a review
   - Click 🗑️ to remove movie

5. **Logout**
   - Click "Logout" button in header
   - Your data is saved in database

---

## API Endpoints

### Quick Reference

#### Authentication
```
POST   /register     - Create new user account
POST   /login        - Login with credentials
```

#### Movies
```
GET    /movies/:userId              - Get user's movies
POST   /movies                      - Save new movie
PUT    /movies/:id                  - Update movie (review, favorite, watched)
DELETE /movies/:id                  - Delete movie
```

#### Debug (Development)
```
GET    /debug/users  - List all users
GET    /debug/movies - List all movies
GET    /debug/all    - List all data
```

For detailed API documentation, see [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

---

## Data Validation

### Frontend Validation
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ Required field validation
- ✅ Review character limit (500 characters)

### Backend Validation
- ✅ Email format and uniqueness
- ✅ Password length requirements
- ✅ Movie data format
- ✅ User ID and movie ID verification
- ✅ Duplicate movie prevention
- ✅ Input sanitization

---

## Error Handling

### User-Friendly Messages
- All errors are displayed to users in clear language
- Validation messages guide users to correct input
- Network errors are handled gracefully

### HTTP Status Codes
- `200` - Successful request
- `201` - Resource created
- `400` - Invalid input
- `401` - Authentication failed
- `404` - Resource not found
- `409` - Resource already exists
- `500` - Server error

---

## Database

### SQLite Database
- **File**: `backend/database.sqlite`
- **Auto-created** on first server start
- **Tables**: `users` and `movies`

### Data Persistence
- All user registrations are saved
- All movies and reviews are persisted
- Favorites and watched status are stored
- Timestamps track creation and updates

---

## Security Notes

### Current Implementation (MVP)
- ⚠️ Passwords stored as plain text (NOT for production)
- ⚠️ No JWT tokens
- ⚠️ CORS enabled for all origins

### Recommendations for Production
- Use bcrypt or similar for password hashing
- Implement JWT authentication
- Restrict CORS to specific domains
- Add rate limiting
- Use environment variables for sensitive data
- Add HTTPS support
- Implement user input sanitization
- Add database migration system

---

## Testing the Application

### Manual Testing Checklist

1. **Registration**
   - [ ] Register with valid email
   - [ ] Try registering with existing email (should fail)
   - [ ] Try registering with invalid email (should fail)
   - [ ] Try registering with short password (should fail)

2. **Login**
   - [ ] Login with correct credentials
   - [ ] Try login with wrong password (should fail)
   - [ ] Try login with non-existent email (should fail)

3. **Movie Search**
   - [ ] Search for popular movie (e.g., "Avatar")
   - [ ] Search for obscure movie
   - [ ] Search with empty field (should show message)

4. **Movie Management**
   - [ ] Add movie to list
   - [ ] Try adding same movie twice (should prevent)
   - [ ] Toggle favorite status
   - [ ] Add review (with various lengths)
   - [ ] Edit existing review
   - [ ] Delete movie with confirmation

5. **Persistence**
   - [ ] Logout and login - movies should still be there
   - [ ] Refresh page - user should stay logged in
   - [ ] Data persists across sessions

6. **UI/UX**
   - [ ] Responsive design (test on mobile)
   - [ ] Loading states appear
   - [ ] Error messages display correctly
   - [ ] Navigation works smoothly

---

## Troubleshooting

### Backend Won't Start
```
Error: Port 3000 is already in use
→ Kill existing process on port 3000 or change PORT in server.js
```

### Frontend Won't Connect to Backend
```
Error: Failed to fetch from localhost:3000
→ Make sure backend server is running
→ Check CORS is enabled in server.js
→ Check API url in App.jsx (should be http://localhost:3000)
```

### Movies Won't Search
```
Error: API request failed / No results
→ Check TMDB API key is correct
→ Verify API key is pasted in App.jsx
→ Check internet connection
→ TMDB might be down or rate limited
```

### Can't Add Movies to List
```
Error: Failed to save movie
→ Make sure you're logged in
→ Check backend is running
→ Check browser console for error details
```

---

## Future Enhancements

### Features to Add
- [ ] Movie ratings and user ratings
- [ ] Social features (follow users, share lists)
- [ ] Advanced search filters (genre, year, rating)
- [ ] Watchlist/"to-watch" functionality
- [ ] User profiles with public lists
- [ ] Movie recommendations based on favorites
- [ ] Dark/light theme toggle
- [ ] Export list to CSV/PDF

### Technical Improvements
- [ ] Unit tests (Jest, React Testing Library)
- [ ] Integration tests (Supertest)
- [ ] Password hashing with bcrypt
- [ ] JWT authentication
- [ ] Input sanitization libraries
- [ ] Database query optimization
- [ ] Caching strategy
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] CI/CD pipeline

---

## File Checklist

### Backend Files (Must Have)
- ✅ `server.js` - Express server with all endpoints
- ✅ `db.js` - Database initialization
- ✅ `package.json` - Dependencies and scripts
- ✅ `.env.example` - Environment variables template
- ✅ `API_DOCUMENTATION.md` - API reference

### Frontend Files (Must Have)
- ✅ `App.jsx` - Main React component with all features
- ✅ `main.jsx` - React entry point
- ✅ `styles.css` - Complete styling
- ✅ `package.json` - Dependencies and scripts
- ✅ `index.html` - HTML template
- ✅ `vite.config.js` - Vite configuration

---

## Contributing

This is a learning project. Feel free to:
- Fork and modify
- Add features
- Improve styling
- Optimize performance
- Add tests

---

## License

MIT License - Feel free to use for learning and personal projects

---

## Support

For issues or questions:
1. Check the API documentation in `backend/API_DOCUMENTATION.md`
2. Review error messages in browser console and terminal
3. Check that all prerequisites are installed
4. Verify TMDB API key is correct
5. Ensure both frontend and backend servers are running

---

## Summary

This application demonstrates a complete full-stack development workflow:
- ✅ User authentication and management
- ✅ Frontend/backend communication via REST API
- ✅ Database persistence
- ✅ Error handling and validation
- ✅ Responsive UI/UX design
- ✅ Clean, organized code
- ✅ API documentation
- ✅ Best practices implementation

**Happy movie tracking! 🎬🍿**
