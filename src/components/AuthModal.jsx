import { useState } from "react";
import { createPortal } from "react-dom";

function AuthModal({ mode, onClose, onSwitchMode, onSuccess }) {
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!emailRegex.test(formData.email)) {
      onSuccess("Please enter a valid email address", "error");
      return;
    }

    if (!isLogin && !passwordRegex.test(formData.password)) {
      onSuccess(
        "Password must contain uppercase, lowercase and a number, and be at least 6 characters",
        "error"
      );
      return;
    }

    if (isLogin && formData.password.length === 0) {
      onSuccess("Please enter your password", "error");
      return;
    }

    if (!isLogin && formData.name.trim().length < 2) {
      onSuccess("Please enter your name", "error");
      return;
    }

    const endpoint = isLogin
      ? "https://sharemart.onrender.com/api/auth/login"
      : "https://sharemart.onrender.com/api/auth/signup";

    const payload = isLogin
      ? {
        email: formData.email,
        password: formData.password,
      }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          onClose();
          onSuccess("Login successful!", "success");
        } else {
          onClose();
          onSuccess("Signup successful!", "success");
        }
      } else {
        onSuccess(data.message, "error");
      }
    } catch (error) {
      onSuccess("Server connection failed.", "error");
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="signup-modal">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>

        <h2>
          {isLogin
            ? "Welcome Back"
            : "Create Account"}
        </h2>

        <p>
          {isLogin
            ? "Login to continue with ShareMart"
            : "Join ShareMart today!"}
        </p>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete={
              isLogin
                ? "current-password"
                : "new-password"
            }
            required
            minLength={6}
          />

          <button
            type="submit"
            className="signup-submit"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

        </form>

        <p
          style={{
            marginTop: "16px",
            fontSize: "14px"
          }}
        >
          {isLogin ? (
            <>
              Don't have an account?{" "}

              <span
                style={{
                  color: "#2f7d3c",
                  cursor: "pointer",
                  fontWeight: 600
                }}
                onClick={() =>
                  onSwitchMode("signup")
                }
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}

              <span
                style={{
                  color: "#2f7d3c",
                  cursor: "pointer",
                  fontWeight: 600
                }}
                onClick={() =>
                  onSwitchMode("login")
                }
              >
                Login
              </span>
            </>
          )}
        </p>

      </div>
    </div>,
    document.body
  );
}

export default AuthModal;