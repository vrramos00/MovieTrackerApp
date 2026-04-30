import { useState, useEffect, useRef } from "react";
import AuthForms from "./components/AuthForms";

const API = "http://localhost:3000";
const TMDB_KEY = "b34a78addf720770b4ca9c195383965c";

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerMobilePhone, setRegisterMobilePhone] = useState("");
  const [registerLocation, setRegisterLocation] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  // Movies state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [myMovies, setMyMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editingReview, setEditingReview] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search"); // "search" or "favorites"
  const [actionMessage, setActionMessage] = useState("");
  const [actionType, setActionType] = useState("success");
  const messageTimerRef = useRef(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("movieTrackerUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadMyMovies(parsedUser.id);
    }

    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const showMessage = (message, type = "success", duration = 3200) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    setActionMessage(message);
    setActionType(type);
    messageTimerRef.current = setTimeout(() => {
      setActionMessage("");
      messageTimerRef.current = null;
    }, duration);
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateUsername = (username) => {
    return /^[A-Za-z0-9._-]{3,20}$/.test(username.trim());
  };

  const validateFullName = (name) => {
    const trimmed = name.trim();
    return trimmed.split(/\s+/).length >= 2 && trimmed.length >= 6;
  };

  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15;
  };

  const validateLocation = (location) => {
    return location.trim().length > 0;
  };

  // Auth handlers
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    setRegisterErrors({});
    setLoading(true);

    if (!registerUsername.trim()) {
      setRegisterErrors({ username: "Username is required" });
      setLoading(false);
      return;
    }
    if (!validateUsername(registerUsername)) {
      setRegisterErrors({ username: "Username must be 3-20 chars and may include letters, numbers, ., _, -" });
      setLoading(false);
      return;
    }
    if (!registerFullName.trim()) {
      setRegisterErrors({ fullName: "Full name is required" });
      setLoading(false);
      return;
    }
    if (!validateFullName(registerFullName)) {
      setRegisterErrors({ fullName: "Please enter your full name (first and last name)" });
      setLoading(false);
      return;
    }
    if (!registerMobilePhone.trim()) {
      setRegisterErrors({ mobilePhone: "Mobile phone is required" });
      setLoading(false);
      return;
    }
    if (!validatePhone(registerMobilePhone)) {
      setRegisterErrors({ mobilePhone: "Mobile phone must contain only digits and be 9-15 chars" });
      setLoading(false);
      return;
    }
    if (!registerLocation.trim()) {
      setRegisterErrors({ location: "Location is required" });
      setLoading(false);
      return;
    }
    if (!validateLocation(registerLocation)) {
      setRegisterErrors({ location: "Please enter a valid location" });
      setLoading(false);
      return;
    }
    if (!registerEmail.trim()) {
      setRegisterErrors({ email: "Email is required" });
      setLoading(false);
      return;
    }
    if (!validateEmail(registerEmail)) {
      setRegisterErrors({ email: "Please enter a valid email" });
      setLoading(false);
      return;
    }
    if (!registerPassword) {
      setRegisterErrors({ password: "Password is required" });
      setLoading(false);
      return;
    }
    if (!validatePassword(registerPassword)) {
      setRegisterErrors({ password: "Password must be at least 6 characters" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail.trim(),
          password: registerPassword,
          username: registerUsername.trim(),
          full_name: registerFullName.trim(),
          mobile_phone: registerMobilePhone.trim(),
          location: registerLocation.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const userData = {
        id: data.data.id,
        email: data.data.email,
        username: data.data.username,
        full_name: data.data.full_name,
        mobile_phone: data.data.mobile_phone,
        location: data.data.location
      };
      localStorage.setItem("movieTrackerUser", JSON.stringify(userData));
      setUser(userData);
      setRegisterUsername("");
      setRegisterFullName("");
      setRegisterMobilePhone("");
      setRegisterLocation("");
      setRegisterEmail("");
      setRegisterPassword("");
      setAuthError("");
      setRegisterErrors({});
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoginErrors({});
    setLoading(true);

    if (!loginEmail.trim()) {
      setLoginErrors({ email: "Email is required" });
      setLoading(false);
      return;
    }
    if (!validateEmail(loginEmail)) {
      setLoginErrors({ email: "Please enter a valid email" });
      setLoading(false);
      return;
    }
    if (!loginPassword) {
      setLoginErrors({ password: "Password is required" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save user to localStorage and state
      const userData = {
        id: data.data.id,
        email: data.data.email,
        username: data.data.username,
        full_name: data.data.full_name,
        mobile_phone: data.data.mobile_phone,
        location: data.data.location
      };
      localStorage.setItem("movieTrackerUser", JSON.stringify(userData));
      setUser(userData);
      setLoginEmail("");
      setLoginPassword("");
      setAuthError("");
      setLoginErrors({});
      
      // Load user's movies
      loadMyMovies(userData.id);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
      messageTimerRef.current = null;
    }
    setUser(null);
    localStorage.removeItem("movieTrackerUser");
    setMyMovies([]);
    setSearchResults([]);
    setQuery("");
    setLoginEmail("");
    setLoginPassword("");
    setRegisterUsername("");
    setRegisterFullName("");
    setRegisterMobilePhone("");
    setRegisterLocation("");
    setRegisterEmail("");
    setRegisterPassword("");
    setAuthError("");
    setLoginErrors({});
    setRegisterErrors({});
    setActionMessage("");
  };

  // Movie handlers
  const searchMovies = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      showMessage("Please enter a movie title", "error");
      return;
    }

    setLoading(true);
    setActionMessage("");

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${query}&page=1`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to search movies");
      }

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        showMessage("No movies found. Try a different search.", "error");
        setSearchResults([]);
      }
    } catch (err) {
      showMessage(`Search error: ${err.message}`, "error");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const saveMovie = async (movie) => {
    setLoading(true);
    setActionMessage("");

    try {
      const res = await fetch(`${API}/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save movie");
      }

      showMessage(`"${movie.title}" added to your list!`, "success");
      await loadMyMovies(user.id);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (movieId, movieTitle) => {
    if (!window.confirm(`Remove "${movieTitle}" from your list?`)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/movies/${movieId}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete movie");
      }

      showMessage("Movie removed!", "success");
      await loadMyMovies(user.id);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (movieId, currentFavorite) => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/movies/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: !currentFavorite })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update favorite");
      }

      showMessage("Favorite updated!", "success");
      await loadMyMovies(user.id);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleWatched = async (movieId, currentWatched) => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/movies/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_watched: !currentWatched })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update watched status");
      }

      showMessage(currentWatched ? "Marked unwatched." : "Marked as watched!", "success");
      await loadMyMovies(user.id);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const startEditReview = (movie) => {
    setEditingMovieId(movie.id);
    setEditingReview(movie.review || "");
  };

  const cancelEditReview = () => {
    setEditingMovieId(null);
    setEditingReview("");
  };

  const saveReview = async (movieId) => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/movies/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: editingReview })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save review");
      }

      showMessage("Review saved!", "success");
      setEditingMovieId(null);
      setEditingReview("");
      await loadMyMovies(user.id);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadMyMovies = async (userId) => {
    try {
      const res = await fetch(`${API}/movies/${userId}`);
      const data = await res.json();

      if (data.success) {
        setMyMovies(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load movies:", err);
    }
  };

  // ========== RENDER ==========

  // Auth screen
  if (!user) {
    return (
      <AuthForms
        authError={authError}
        loading={loading}
        loginEmail={loginEmail}
        loginPassword={loginPassword}
        loginErrors={loginErrors}
        registerErrors={registerErrors}
        registerUsername={registerUsername}
        registerFullName={registerFullName}
        registerMobilePhone={registerMobilePhone}
        registerLocation={registerLocation}
        registerEmail={registerEmail}
        registerPassword={registerPassword}
        setLoginEmail={setLoginEmail}
        setLoginPassword={setLoginPassword}
        setRegisterUsername={setRegisterUsername}
        setRegisterFullName={setRegisterFullName}
        setRegisterMobilePhone={setRegisterMobilePhone}
        setRegisterLocation={setRegisterLocation}
        setRegisterEmail={setRegisterEmail}
        setRegisterPassword={setRegisterPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        validateEmail={validateEmail}
        validatePassword={validatePassword}
        validateUsername={validateUsername}
        validateFullName={validateFullName}
        validatePhone={validatePhone}
        validateLocation={validateLocation}
      />
    );
  }

  // Main app screen
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 Movie Tracker</h1>
          <div className="user-info">
            <span>Welcome, {user.username || user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      {actionMessage && (
        <div className={`alert ${actionType === "error" ? "alert-error" : "alert-success"}`}>
          <span className="alert-icon">
            {actionType === "error" ? "⚠️" : "✅"}
          </span>
          <span className="alert-message">{actionMessage}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="app-main">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Search Movies
          </button>
          <button
            className={`tab ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            ⭐ My List ({myMovies.length})
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <section className="search-section">
            <h2>Find Movies</h2>
            <form className="search-form" onSubmit={searchMovies}>
              <input
                type="text"
                placeholder="Search by movie title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || TMDB_KEY.includes("YOUR_")}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {TMDB_KEY.includes("YOUR_") && (
              <div className="warning">
                ⚠️ <strong>Add your TMDB API key</strong> to enable movie search. Get one free at{" "}
                <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer">
                  themoviedb.org
                </a>
              </div>
            )}

            <div className="results-grid">
              {searchResults.length > 0 ? (
                searchResults.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <div className="movie-poster">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                        />
                      ) : (
                        <div className="no-poster">No Image</div>
                      )}
                    </div>
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      {movie.release_date && (
                        <p className="year">({movie.release_date.split("-")[0]})</p>
                      )}
                      {movie.vote_average && (
                        <p className="rating">⭐ {movie.vote_average.toFixed(1)}/10</p>
                      )}
                      <button
                        className="btn-primary"
                        onClick={() => saveMovie(movie)}
                        disabled={loading}
                      >
                        + Add to List
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">
                  {query ? "No results found. Try another search!" : "Search for movies to get started"}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <section className="favorites-section">
            <h2>My Movie List</h2>

            {myMovies.length === 0 ? (
              <div className="empty-state">
                <p>Your list is empty. Search for movies to add them!</p>
              </div>
            ) : (
              <div className="movies-list">
                {myMovies.map((movie) => (
                  <div key={movie.id} className="movie-item">
                    <div className="movie-header">
                      <h3>{movie.title}</h3>
                      <div className="movie-actions">
                        <button
                          className={`btn-favorite ${movie.is_favorite ? "active" : ""}`}
                          onClick={() => toggleFavorite(movie.id, movie.is_favorite)}
                          disabled={loading}
                          title="Toggle favorite"
                        >
                          {movie.is_favorite ? "⭐" : "☆"}
                        </button>
                        <button
                          className={`btn-watched ${movie.is_watched ? "active" : ""}`}
                          onClick={() => toggleWatched(movie.id, movie.is_watched)}
                          disabled={loading}
                          title={movie.is_watched ? "Mark as unwatched" : "Mark as watched"}
                        >
                          {movie.is_watched ? "👁️" : "👁️‍🗨️"}
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteMovie(movie.id, movie.title)}
                          disabled={loading}
                          title="Remove from list"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="watched-info">
                      {movie.is_watched ? (
                        <span>Watched on {movie.watched_date || "unknown date"}</span>
                      ) : (
                        <span>Not watched yet</span>
                      )}
                    </div>

                    {editingMovieId === movie.id ? (
                      <div className="review-editor">
                        <textarea
                          value={editingReview}
                          onChange={(e) => setEditingReview(e.target.value)}
                          placeholder="Write your review..."
                          maxLength="500"
                        />
                        <div className="review-actions">
                          <button
                            className="btn-save"
                            onClick={() => saveReview(movie.id)}
                            disabled={loading}
                          >
                            {loading ? "Saving..." : "Save Review"}
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={cancelEditReview}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="review-display">
                        {movie.review ? (
                          <>
                            <p className="review-text">{movie.review}</p>
                            <button
                              className="btn-edit"
                              onClick={() => startEditReview(movie)}
                              disabled={loading}
                            >
                              Edit Review
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-add-review"
                            onClick={() => startEditReview(movie)}
                            disabled={loading}
                          >
                            + Add Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}