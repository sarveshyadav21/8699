import React, { useState } from "react";
import "../styles/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://eight699-4.onrender.com/login", {
        email,
        password,
      });
      if (res.status === 200) {
        const { token } = response.data;

        localStorage.setItem("userToken", token);
        navigate("/dashboard"); // Redirect user to a dashboard or home page
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Login failed. Please try again."
        );
      } else {
        setError(
          "An error occurred. Please check your connection and try again."
        );
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-container">
          <input
            className="input-field"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            className="input-field"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <a href="/forgot-password" className="forgot-password-link">
          Forgot password?
        </a>
        <button className="login-button" type="submit">
          Login
        </button>
        <div className="signup-text">
          Don't have an account yet?
          <a href="/signup" className="form-link">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
