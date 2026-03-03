import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";

const Login = () => {
  const navigate = useNavigate();

  const CORRECT_USERNAME = "admin";
  const CORRECT_PASSWORD = "123456";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isValid =
    username.trim() === CORRECT_USERNAME &&
    password.trim() === CORRECT_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) return;

    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="background"></div>

      <div className="login-box">
        <div className="logo">
          <svg
            className="logo-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="32,8 56,52 8,52" fill="#ecb613" />
            ={" "}
            <line
              x1="32"
              y1="8"
              x2="32"
              y2="52"
              stroke="#d4a514"
              strokeWidth="2"
            />
          </svg>

          <span className="logo-text">The Grand Egyptian Museum</span>
        </div>
        <h1>Welcome Back</h1>
        <h2>
          Explore the wonders of ancient Egypt with your personal account.
        </h2>
        <form onSubmit={handleSubmit}>
          <label>Email or Username</label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined">person</span>

            <input
              type="text"
              placeholder="Enter your email or username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined">lock</span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className="material-symbols-outlined toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </div>

          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={!isValid}
            style={{
              opacity: isValid ? 1 : 0.6,
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            Log In
          </button>
        </form>
       
          {" "}
          <p className="signup-text">New to the museum? <a href="./register.jxs"><span> Sign Up</span></a></p>
        {" "}
      </div>
    </div>
  );
};

export default Login;
