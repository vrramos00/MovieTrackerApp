import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let db;

// INIT DB
initDB().then(database => {
  db = database;
  console.log("DB ready");
});

/* ======================
   VALIDATION HELPERS
====================== */

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function isValidPassword(password) {
  return password && password.length >= 6 && password.length <= 100;
}

function isValidUsername(username) {
  return typeof username === 'string' && /^[A-Za-z0-9._-]{3,20}$/.test(username.trim());
}

function isValidFullName(fullName) {
  return typeof fullName === 'string' && fullName.trim().split(/\s+/).length >= 2 && fullName.trim().length >= 6;
}

function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

function isValidLocation(location) {
  return typeof location === 'string' && location.trim().length >= 3;
}

function formatWatchedDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim();
}

/* ======================
   ROOT
====================== */
app.get("/", (req, res) => {
  res.json({
    status: "Movie Tracker API running",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /register": "Register a new user",
        "POST /login": "Login user"
      },
      movies: {
        "GET /movies/:userId": "Get all movies for a user",
        "POST /movies": "Save a new movie",
        "PUT /movies/:id": "Update movie (review, favorite, watched)",
        "DELETE /movies/:id": "Delete a movie"
      },
      debug: {
        "GET /debug/users": "List all users",
        "GET /debug/movies": "List all movies",
        "GET /debug/all": "List all data"
      }
    }
  });
});

/* ======================
   AUTH
====================== */

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password, username, full_name, mobile_phone, location } = req.body;

  // Validation
  if (!email || !password || !username || !full_name || !mobile_phone || !location) {
    return res.status(400).json({ 
      success: false,
      error: "All registration fields are required" 
    });
  }

  const emailSanitized = sanitizeInput(email).toLowerCase();
  const passwordSanitized = sanitizeInput(password);
  const usernameSanitized = sanitizeInput(username);
  const fullNameSanitized = sanitizeInput(full_name);
  const mobilePhoneSanitized = sanitizeInput(mobile_phone);
  const locationSanitized = sanitizeInput(location);

  if (!isValidEmail(emailSanitized)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid email format" 
    });
  }

  if (!isValidPassword(passwordSanitized)) {
    return res.status(400).json({ 
      success: false,
      error: "Password must be between 6 and 100 characters" 
    });
  }

  if (!isValidUsername(usernameSanitized)) {
    return res.status(400).json({ 
      success: false,
      error: "Username must be 3-20 characters and may include letters, numbers, ., _, and -" 
    });
  }

  if (!isValidFullName(fullNameSanitized)) {
    return res.status(400).json({ 
      success: false,
      error: "Please enter a full name with at least first and last name" 
    });
  }

  if (!isValidPhone(mobilePhoneSanitized)) {
    return res.status(400).json({ 
      success: false,
      error: "Please enter a valid mobile phone number" 
    });
  }

  if (!isValidLocation(locationSanitized)) {
    return res.status(400).json({ 
      success: false,
      error: "Please enter a valid location" 
    });
  }

  try {
    const result = await db.run(
      `INSERT INTO users (email, password, username, full_name, mobile_phone, location) VALUES (?, ?, ?, ?, ?, ?)`,
      [emailSanitized, passwordSanitized, usernameSanitized, fullNameSanitized, mobilePhoneSanitized, locationSanitized]
    );

    res.status(201).json({ 
      success: true,
      data: {
        id: result.lastID,
        email: emailSanitized,
        username: usernameSanitized,
        full_name: fullNameSanitized,
        mobile_phone: mobilePhoneSanitized,
        location: locationSanitized
      }
    });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      if (error.message.includes("users.username")) {
        return res.status(409).json({ success: false, error: "Username already in use" });
      }
      return res.status(409).json({ success: false, error: "Email already registered" });
    }
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: "Email and password are required" 
    });
  }

  const emailSanitized = sanitizeInput(email).toLowerCase();
  const passwordSanitized = sanitizeInput(password);

  try {
    const user = await db.get(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [emailSanitized, passwordSanitized]
    );

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password" 
      });
    }

    res.json({ 
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        mobile_phone: user.mobile_phone,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Login failed" 
    });
  }
});

/* ======================
   MOVIES (USER DATA)
====================== */

// GET movies for a user
app.get("/movies/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid user ID" 
    });
  }

  try {
    const movies = await db.all(
      "SELECT * FROM movies WHERE user_id = ?",
      [parseInt(userId)]
    );

    res.json({ 
      success: true,
      data: movies 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch movies" 
    });
  }
});

// SAVE movie
app.post("/movies", async (req, res) => {
  const {
    user_id,
    movie_id,
    title
  } = req.body;

  // Validation
  if (!user_id || !movie_id || !title) {
    return res.status(400).json({ 
      success: false,
      error: "user_id, movie_id, and title are required" 
    });
  }

  if (isNaN(user_id) || isNaN(movie_id)) {
    return res.status(400).json({ 
      success: false,
      error: "user_id and movie_id must be numbers" 
    });
  }

  const titleSanitized = sanitizeInput(title);

  try {
    // Check if it exists
    const existing = await db.get(
      "SELECT * FROM movies WHERE user_id = ? AND movie_id = ?",
      [user_id, movie_id]
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "Movie already saved",
        data: existing
      });
    }

    // INSERT if it doesn't exist
    const result = await db.run(
      `INSERT INTO movies (user_id, movie_id, title, is_favorite, is_watched, review)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, movie_id, titleSanitized, 0, 0, ""]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.lastID,
        user_id,
        movie_id,
        title: titleSanitized,
        is_favorite: 0,
        is_watched: 0,
        review: ""
      },
      message: "Movie saved successfully"
    });

  } catch (error) {
    console.error("Error saving movie:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to save movie" 
    });
  }
});

// UPDATE movie (review, favorite, watched status)
app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { review, is_favorite, is_watched } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid movie ID" 
    });
  }

  try {
    // Check if movie exists
    const movie = await db.get(
      "SELECT * FROM movies WHERE id = ?",
      [id]
    );

    if (!movie) {
      return res.status(404).json({ 
        success: false,
        error: "Movie not found" 
      });
    }

    // Prepare update values
    const updateValues = {};
    if (review !== undefined) updateValues.review = sanitizeInput(review);
    if (is_favorite !== undefined) updateValues.is_favorite = is_favorite ? 1 : 0;
    if (is_watched !== undefined) {
      updateValues.is_watched = is_watched ? 1 : 0;
      updateValues.watched_date = is_watched ? formatWatchedDate() : null;
    }

    if (Object.keys(updateValues).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "No fields to update" 
      });
    }

    // Build dynamic UPDATE query
    const updateFields = Object.keys(updateValues).map(key => `${key} = ?`).join(", ");
    const updateParams = Object.values(updateValues);

    await db.run(
      `UPDATE movies SET ${updateFields} WHERE id = ?`,
      [...updateParams, id]
    );

    const updatedMovie = await db.get(
      "SELECT * FROM movies WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      data: updatedMovie,
      message: "Movie updated successfully"
    });

  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update movie" 
    });
  }
});

// DELETE movie
app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid movie ID" 
    });
  }

  try {
    // Check if movie exists
    const movie = await db.get(
      "SELECT * FROM movies WHERE id = ?",
      [id]
    );

    if (!movie) {
      return res.status(404).json({ 
        success: false,
        error: "Movie not found" 
      });
    }

    await db.run(
      "DELETE FROM movies WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Movie deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete movie" 
    });
  }
});

/* ======================
   DEBUG ROUTES (IMPORTANT)
====================== */

// Show every user
app.get("/debug/users", async (req, res) => {
  try {
    const users = await db.all("SELECT * FROM users");
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch users" 
    });
  }
});

// See every movie saved
app.get("/debug/movies", async (req, res) => {
  try {
    const movies = await db.all("SELECT * FROM movies");
    res.json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch movies" 
    });
  }
});

// Global view (useful for demo)
app.get("/debug/all", async (req, res) => {
  try {
    const users = await db.all("SELECT * FROM users");
    const movies = await db.all("SELECT * FROM movies");

    res.json({
      success: true,
      users: {
        count: users.length,
        data: users
      },
      movies: {
        count: movies.length,
        data: movies
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch data" 
    });
  }
});

/* ======================
   ERROR HANDLING
====================== */

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});