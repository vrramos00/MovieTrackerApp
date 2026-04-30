import { COUNTRIES } from "../countries";

export default function AuthForms({
  authError,
  loading,
  loginEmail,
  loginPassword,
  loginErrors,
  registerErrors,
  registerUsername,
  registerFullName,
  registerMobilePhone,
  registerLocation,
  registerEmail,
  registerPassword,
  setLoginEmail,
  setLoginPassword,
  setRegisterUsername,
  setRegisterFullName,
  setRegisterMobilePhone,
  setRegisterLocation,
  setRegisterEmail,
  setRegisterPassword,
  handleLogin,
  handleRegister,
  validateEmail,
  validatePassword,
  validateUsername,
  validateFullName,
  validatePhone,
  validateLocation
}) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div>
            <h1>🎬 Movie Tracker</h1>
            <p className="subtitle">Discover, track, and review your favorite movies</p>
          </div>
          <p className="auth-help">Choose one to get started, then save and review movies in your list.</p>
        </div>

        {authError && <div className="error-message">{authError}</div>}

        <div className="auth-grid">
          <div className="auth-panel">
            <form className="auth-form" onSubmit={handleLogin} autoComplete="off">
              <h2>Login</h2>
              <div className="field-group">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="username"
                  className={loginErrors.email ? "input-error" : ""}
                  value={loginEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLoginEmail(value);
                    // setLoginErrors((prev) => ({
                    //   ...prev,
                    //   email: value.length > 0 && !validateEmail(value) ? "Please enter a valid email" : ""
                    // }));
                  }}
                  disabled={loading}
                />
                {loginErrors.email && <div className="field-error">{loginErrors.email}</div>}
              </div>

              <div className="field-group">
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  autoComplete="current-password"
                  className={loginErrors.password ? "input-error" : ""}
                  value={loginPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLoginPassword(value);
                //     setLoginErrors((prev) => ({
                //       ...prev,
                //       password: value.length > 0 && !validatePassword(value) ? "Password must be at least 6 characters" : ""
                //     }));
                   }}
                  disabled={loading}
                />
                {loginErrors.password && <div className="field-error">{loginErrors.password}</div>}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>

          <div className="auth-panel">
            <form className="auth-form" onSubmit={handleRegister} autoComplete="off">
              <h2>Create Account</h2>

              <div className="field-group">
                <input
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  className={registerErrors.username ? "input-error" : ""}
                  value={registerUsername}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRegisterUsername(value);
                    setRegisterErrors((prev) => ({
                      ...prev,
                      username: value.length > 0 && !validateUsername(value)
                        ? "Username must be 3-20 chars and may include letters, numbers, ., _, -"
                        : ""
                    }));
                  }}
                  disabled={loading}
                />
                {registerErrors.username && <div className="field-error">{registerErrors.username}</div>}
              </div>

              <div className="field-group">
                <input
                  type="text"
                  placeholder="Full name"
                  autoComplete="name"
                  className={registerErrors.fullName ? "input-error" : ""}
                  value={registerFullName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRegisterFullName(value);
                    setRegisterErrors((prev) => ({
                      ...prev,
                      fullName: value.length > 0 && !validateFullName(value)
                        ? "Please enter your full name (first and last name)"
                        : ""
                    }));
                  }}
                  disabled={loading}
                />
                {registerErrors.fullName && <div className="field-error">{registerErrors.fullName}</div>}
              </div>

              <div className="field-group">
                <input
                  type="tel"
                  placeholder="Mobile phone"
                  autoComplete="tel"
                  className={registerErrors.mobilePhone ? "input-error" : ""}
                  value={registerMobilePhone}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    setRegisterMobilePhone(digitsOnly);
                    setRegisterErrors((prev) => ({
                      ...prev,
                      mobilePhone: digitsOnly.length > 0 && !validatePhone(digitsOnly)
                        ? "Mobile phone must be 9-15 digits"
                        : ""
                    }));
                  }}
                  disabled={loading}
                />
                {registerErrors.mobilePhone && <div className="field-error">{registerErrors.mobilePhone}</div>}
              </div>

              <div className="field-group">
                <select
                  className={registerErrors.location ? "input-error" : ""}
                  value={registerLocation}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRegisterLocation(value);
                    setRegisterErrors((prev) => ({
                      ...prev,
                      location: value.length > 0 && !validateLocation(value)
                        ? "Please select a valid country"
                        : ""
                    }));
                  }}
                  disabled={loading}
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {registerErrors.location && <div className="field-error">{registerErrors.location}</div>}
              </div>

              <div className="field-group">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className={registerErrors.email ? "input-error" : ""}
                  value={registerEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRegisterEmail(value);
                    setRegisterErrors((prev) => ({
                      ...prev,
                      email: value.length > 0 && !validateEmail(value)
                        ? "Please enter a valid email"
                        : ""
                    }));
                  }}
                  disabled={loading}
                />
                {registerErrors.email && <div className="field-error">{registerErrors.email}</div>}
              </div>

              <div className="field-group">
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  autoComplete="new-password"
                  className={registerErrors.password ? "input-error" : ""}
                  value={registerPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRegisterPassword(value);
                    setRegisterErrors((prev) => ({
                      ...prev,
                      password: value.length > 0 && !validatePassword(value)
                        ? "Password must be at least 6 characters"
                        : ""
                    }));
                  }}
                  disabled={loading}
                />
                {registerErrors.password && <div className="field-error">{registerErrors.password}</div>}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
