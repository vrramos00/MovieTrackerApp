# Testing Guide

Complete checklist to verify all features are working correctly.

## Prerequisites
- Backend running on http://localhost:3000
- Frontend running on http://localhost:5173  
- TMDB API key configured in App.jsx
- Browser with developer console open (F12)

---

## Test Case 1: User Registration

### Test 1.1: Valid Registration
1. Go to application homepage
2. Click "Create New Account"
3. Enter email: `testuser@example.com`
4. Enter password: `password123`
5. Click submit button

**Expected Result**: ✅ User created and logged in automatically

### Test 1.2: Invalid Email
1. Click "Create New Account"  
2. Enter email: `invalidemail`
3. Enter password: `password123`
4. Click submit

**Expected Result**: ✅ Error: "Please enter a valid email"

### Test 1.3: Short Password
1. Click "Create New Account"
2. Enter email: `test2@example.com`
3. Enter password: `123`
4. Click submit

**Expected Result**: ✅ Error: "Password must be at least 6 characters"

### Test 1.4: Duplicate Email
1. Click "Create New Account"
2. Enter email: `testuser@example.com` (already used)
3. Enter password: `password123`
4. Click submit

**Expected Result**: ✅ Error: "Email already registered"

---

## Test Case 2: User Login

### Test 2.1: Valid Login
1. Logout (if logged in)
2. Enter email: `testuser@example.com`
3. Enter password: `password123`
4. Click "Login"

**Expected Result**: ✅ User logged in, redirected to main app

### Test 2.2: Wrong Password
1. Enter email: `testuser@example.com`
2. Enter password: `wrongpassword`
3. Click "Login"

**Expected Result**: ✅ Error: "Invalid email or password"

### Test 2.3: Non-existent Email
1. Enter email: `nonexistent@example.com`
2. Enter password: `password123`
3. Click "Login"

**Expected Result**: ✅ Error: "Invalid email or password"

---

## Test Case 3: Movie Search

### Test 3.1: Valid Search
1. Login to application
2. Click "Search Movies" tab
3. Enter: `Avatar`
4. Click "Search"

**Expected Result**: ✅ Movies displayed with poster images, titles, years, ratings

### Test 3.2: No Results
1. Enter search: `xyznotarealmovie12345`
2. Click "Search"

**Expected Result**: ✅ Message: "No movies found. Try a different search."

### Test 3.3: Empty Search
1. Leave search field empty
2. Click "Search"

**Expected Result**: ✅ Message: "Please enter a movie title"

---

## Test Case 4: Add Movies to List

### Test 4.1: Add Single Movie
1. Search for "Inception"
2. Click "+ Add to List" on first result
3. Check "My List" tab

**Expected Result**: ✅ Movie appears in "My List" with no review yet

### Test 4.2: Add Duplicate
1. Search for "Inception" again
2. Click "+ Add to List"

**Expected Result**: ✅ Error message about movie already being in list

### Test 4.3: Multiple Movies
1. Add 3-5 different movies
2. Go to "My List" tab

**Expected Result**: ✅ All movies appear in list, count shows correct number

---

## Test Case 5: Favorite Toggling

### Test 5.1: Mark as Favorite
1. Go to "My List" tab
2. Click ☆ (empty star) on any movie

**Expected Result**: ✅ Star becomes filled ⭐

### Test 5.2: Remove Favorite
1. Click ⭐ (filled star)

**Expected Result**: ✅ Star becomes empty ☆

---

## Test Case 6: Review Management

### Test 6.1: Add Review
1. Go to "My List" tab
2. Click "+ Add Review" on a movie
3. Enter review: `This is a great movie!`
4. Click "Save Review"

**Expected Result**: ✅ Review saved, button changes to "Edit Review"

### Test 6.2: Edit Review
1. Click "Edit Review"
2. Change text to: `Updated review with more details`
3. Click "Save Review"

**Expected Result**: ✅ Review updated successfully

### Test 6.3: Long Review
1. Click "Edit Review"
2. Enter review with 400+ characters (test max length)
3. Try typing more than 500 characters (should be prevented)

**Expected Result**: ✅ Textarea has maxLength of 500

### Test 6.4: Cancel Edit
1. Click "Edit Review"
2. Start typing new review
3. Click "Cancel"

**Expected Result**: ✅ Changes discarded, original review shown

---

## Test Case 7: Delete Movie

### Test 7.1: Delete with Confirmation
1. Go to "My List" tab
2. Click 🗑️ on any movie
3. Confirm deletion in dialog

**Expected Result**: ✅ Movie removed from list

### Test 7.2: Delete Cancellation
1. Click 🗑️
2. Click "Cancel" in dialog

**Expected Result**: ✅ Movie remains in list

---

## Test Case 8: Session Persistence

### Test 8.1: Logout and Login
1. Note your movies in the list
2. Click "Logout"
3. Login again with same credentials
4. Go to "My List"

**Expected Result**: ✅ All movies and reviews are still there

### Test 8.2: Page Refresh
1. Go to "My List"
2. Refresh page (F5)
3. Check if still logged in

**Expected Result**: ✅ User remains logged in, movies loaded

### Test 8.3: Close and Reopen Browser
1. Close the browser tab
2. Go to http://localhost:5173
3. Check if still logged in

**Expected Result**: ✅ User remains logged in

---

## Test Case 9: UI/UX Features

### Test 9.1: Tab Navigation
1. Click between "Search Movies" and "My List" tabs

**Expected Result**: ✅ Content switches smoothly with animation

### Test 9.2: Loading States
1. Click "Search" and watch for loading indicator
2. Add a movie and watch for loading state

**Expected Result**: ✅ Loading messages appear/disappear appropriately

### Test 9.3: Error Messages
1. Trigger an error (try invalid login)

**Expected Result**: ✅ Error message appears with clear explanation

### Test 9.4: Responsive Design
1. Resize browser window
2. Test on mobile device (DevTools)

**Expected Result**: ✅ Layout adapts, buttons/inputs still usable

---

## Test Case 10: Error Handling

### Test 10.1: Backend Connection Error
1. Stop backend server
2. Try to login or search

**Expected Result**: ✅ Error message shown (not crash)

### Test 10.2: TMDB API Error
1. Use invalid API key
2. Try to search

**Expected Result**: ✅ Error handled gracefully with message

---

## Database Verification

### Check Saved Data
1. In terminal, check backend database:

```bash
# From backend directory
sqlite3 database.sqlite

# In sqlite prompt:
SELECT * FROM users;
SELECT * FROM movies;
.exit
```

**Expected Result**: ✅ Users and movies appear with all data

---

## API Testing with cURL

### Test Register Endpoint
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"apitest@example.com","password":"password123"}'
```

**Expected Result**: ✅ Returns user ID and email

### Test Login Endpoint
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"apitest@example.com","password":"password123"}'
```

**Expected Result**: ✅ Returns user ID and email

### Test Save Movie
```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"movie_id":550,"title":"Fight Club"}'
```

**Expected Result**: ✅ Returns movie with ID and success status

### Test Get Movies
```bash
curl http://localhost:3000/movies/1
```

**Expected Result**: ✅ Returns array of user's movies

### Test Update Movie
```bash
curl -X PUT http://localhost:3000/movies/1 \
  -H "Content-Type: application/json" \
  -d '{"review":"Great movie!","is_favorite":1}'
```

**Expected Result**: ✅ Returns updated movie

### Test Delete Movie
```bash
curl -X DELETE http://localhost:3000/movies/1
```

**Expected Result**: ✅ Returns success message

---

## Performance Testing

### Test Load Time
1. Open DevTools Network tab
2. Reload page
3. Measure load time

**Expected Result**: ✅ Page loads in under 2 seconds

### Test API Response Times
1. Monitor network requests in DevTools
2. Check API response times

**Expected Result**: ✅ API responses under 500ms

---

## Summary Checklist

- [ ] Registration works with validation
- [ ] Login works with proper error handling
- [ ] Movie search returns results
- [ ] Can add/remove movies
- [ ] Favorites toggle works
- [ ] Reviews can be added/edited
- [ ] Data persists across sessions
- [ ] UI is responsive
- [ ] Error messages are helpful
- [ ] All API endpoints work
- [ ] Database stores data correctly

---

## Troubleshooting Test Failures

**Movies won't search**
- Verify TMDB API key is correct in App.jsx
- Check internet connection
- Check browser console for errors

**Can't save movies**
- Verify backend is running on port 3000
- Check browser console for fetch errors
- Check backend server logs for errors

**Data not persisting**
- Check localStorage is enabled in browser
- Check database.sqlite exists in backend folder
- Restart both servers

**UI looks broken**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check styles.css is loaded (DevTools Network tab)

---

## Notes

- Use `http://localhost:3000` for backend (not localhost:3000 without http://)
- TMDB API uses free tier - limited to 40 requests per 10 seconds
- SQLite database is file-based, delete database.sqlite to reset
- All timestamps in database are in UTC
