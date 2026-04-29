# Movie Tracker API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Currently uses simple email/password authentication. Users must register and login before accessing movie endpoints.

---

## Endpoints

### 1. Root Endpoint
**GET** `/`
- **Description**: Returns API status and available endpoints
- **Response**:
  ```json
  {
    "status": "Movie Tracker API running",
    "version": "1.0.0",
    "endpoints": {
      "auth": { ... },
      "movies": { ... },
      "debug": { ... }
    }
  }
  ```

---

## Authentication Endpoints

### 2. Register User
**POST** `/register`
- **Description**: Create a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Validation**:
  - Email must be valid format (contains @ and .)
  - Email must be max 255 characters
  - Password must be 6-100 characters
  - Email must be unique
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com"
    }
  }
  ```
- **Error Response (400/409)**:
  ```json
  {
    "success": false,
    "error": "Email already registered"
  }
  ```

### 3. Login User
**POST** `/login`
- **Description**: Authenticate user with email and password
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Validation**:
  - Email and password are required
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com"
    }
  }
  ```
- **Error Response (401)**:
  ```json
  {
    "success": false,
    "error": "Invalid email or password"
  }
  ```

---

## Movie Endpoints

### 4. Get User's Movies
**GET** `/movies/:userId`
- **Description**: Retrieve all movies saved by a user
- **Parameters**:
  - `userId` (required, integer): User ID
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "movie_id": 550,
        "title": "Fight Club",
        "is_favorite": 1,
        "is_watched": 0,
        "review": "Amazing movie!",
        "created_at": "2024-01-15 10:30:00",
        "updated_at": "2024-01-15 14:20:00"
      }
    ]
  }
  ```
- **Error Response (400/500)**:
  ```json
  {
    "success": false,
    "error": "Invalid user ID"
  }
  ```

### 5. Save Movie
**POST** `/movies`
- **Description**: Add a movie to user's list
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "movie_id": 550,
    "title": "Fight Club"
  }
  ```
- **Validation**:
  - `user_id`, `movie_id`, and `title` are required
  - `user_id` and `movie_id` must be numbers
  - Movie cannot be added twice by same user
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "user_id": 1,
      "movie_id": 550,
      "title": "Fight Club",
      "is_favorite": 0,
      "is_watched": 0,
      "review": ""
    },
    "message": "Movie saved successfully"
  }
  ```
- **Error Response (409 - Already exists)**:
  ```json
  {
    "success": false,
    "error": "Movie already saved",
    "data": { ... }
  }
  ```

### 6. Update Movie
**PUT** `/movies/:id`
- **Description**: Update movie details (review, favorite status, watched status)
- **Parameters**:
  - `id` (required, integer): Movie record ID
- **Request Body** (send only fields to update):
  ```json
  {
    "review": "Amazing cinematography!",
    "is_favorite": 1,
    "is_watched": 1
  }
  ```
- **Validation**:
  - Movie must exist
  - At least one field must be provided for update
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "user_id": 1,
      "movie_id": 550,
      "title": "Fight Club",
      "is_favorite": 1,
      "is_watched": 0,
      "review": "Amazing cinematography!"
    },
    "message": "Movie updated successfully"
  }
  ```
- **Error Response (404)**:
  ```json
  {
    "success": false,
    "error": "Movie not found"
  }
  ```

### 7. Delete Movie
**DELETE** `/movies/:id`
- **Description**: Remove a movie from user's list
- **Parameters**:
  - `id` (required, integer): Movie record ID
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Movie deleted successfully"
  }
  ```
- **Error Response (404)**:
  ```json
  {
    "success": false,
    "error": "Movie not found"
  }
  ```

---

## Debug Endpoints

### 8. Get All Users
**GET** `/debug/users`
- **Description**: Returns all registered users (for development only)
- **Response**:
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      { "id": 1, "email": "user1@example.com", "created_at": "..." },
      { "id": 2, "email": "user2@example.com", "created_at": "..." }
    ]
  }
  ```

### 9. Get All Movies
**GET** `/debug/movies`
- **Description**: Returns all saved movies (for development only)
- **Response**:
  ```json
  {
    "success": true,
    "count": 10,
    "data": [ ... ]
  }
  ```

### 10. Get All Data
**GET** `/debug/all`
- **Description**: Returns all users and movies data (for development only)
- **Response**:
  ```json
  {
    "success": true,
    "users": { "count": 5, "data": [ ... ] },
    "movies": { "count": 10, "data": [ ... ] }
  }
  ```

---

## Error Handling

### HTTP Status Codes
- **200 OK**: Successful GET/PUT request
- **201 Created**: Successful POST request (resource created)
- **400 Bad Request**: Invalid input or missing required fields
- **401 Unauthorized**: Invalid credentials
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource already exists (e.g., duplicate movie)
- **500 Internal Server Error**: Server error

### Error Response Format
All error responses follow this format:
```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

---

## Example Workflows

### 1. Complete User Journey
```
1. POST /register → Create account
2. POST /login → Get user ID
3. GET /movies/:userId → View saved movies (initially empty)
4. POST /movies → Add new movie from search results
5. PUT /movies/:id → Add review or mark as favorite
6. DELETE /movies/:id → Remove movie
```

### 2. Using cURL

**Register**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Get Movies**
```bash
curl http://localhost:3000/movies/1
```

**Save Movie**
```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"movie_id":550,"title":"Fight Club"}'
```

**Update Review**
```bash
curl -X PUT http://localhost:3000/movies/1 \
  -H "Content-Type: application/json" \
  -d '{"review":"Great movie!"}'
```

**Toggle Favorite**
```bash
curl -X PUT http://localhost:3000/movies/1 \
  -H "Content-Type: application/json" \
  -d '{"is_favorite":true}'
```

**Delete Movie**
```bash
curl -X DELETE http://localhost:3000/movies/1
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Movies Table
```sql
CREATE TABLE movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT 0,
  is_watched BOOLEAN DEFAULT 0,
  review TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, movie_id)
);
```

---

## Security Notes

### Current Implementation (MVP)
- ⚠️ Passwords are stored as plain text (NOT SECURE FOR PRODUCTION)
- ⚠️ No authentication tokens or sessions
- ⚠️ No input sanitization beyond basic validation

### For Production, Consider:
- ✅ Hash passwords with bcrypt
- ✅ Implement JWT tokens
- ✅ Add CORS restrictions
- ✅ Rate limiting
- ✅ Input validation and sanitization libraries
- ✅ HTTPS only
- ✅ SQL injection prevention (already using parameterized queries)
- ✅ Environment variables for sensitive data

---

## Development Notes

### Running the Server
```bash
npm install
npm run dev
```

Server runs on `http://localhost:3000`

### Database
- SQLite database stored in `database.sqlite`
- Auto-creates tables on first run
- Delete `database.sqlite` to reset

### Testing Endpoints
Use Postman, Insomnia, or cURL to test endpoints
Debug endpoints (`/debug/*`) show all data for easy testing
