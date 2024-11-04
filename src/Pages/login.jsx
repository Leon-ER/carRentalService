import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/login";
import "../CSS/login.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let role = null;

      if (isLoginMode) {
        const loginResponse = await login(email, password);
        role = loginResponse.role;
      } else {
        await signup(lastName, firstName, phone, email, password);
      }

      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("userEmail", email);

      if (role) {
        localStorage.setItem("userRole", role);
      }

      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4 border p-4 rounded">
              <h1 className="text-center mb-4">
                {isLoginMode ? "Login" : "Signup"}
              </h1>
              {!isLoginMode && (
                <>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? isLoginMode
                    ? "Logging in..."
                    : "Signing up..."
                  : isLoginMode
                  ? "Login"
                  : "Signup"}
              </button>
              {error && <p className="text-danger text-center mt-3">{error}</p>}
              <button
                className="btn btn-link w-100 mt-2"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode
                  ? "Don't have an account? Signup"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Login;
