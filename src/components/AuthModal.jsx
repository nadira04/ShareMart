import { useState } from "react";
import { createPortal } from "react-dom";

function AuthModal({ mode, onClose, onSwitchMode, onSuccess })  {
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

  const endpoint = isLogin
    ? "http://localhost:5000/api/auth/login"
    : "http://localhost:5000/api/auth/signup";

  const payload = isLogin
    ? { email: formData.email, password: formData.password }
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
        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save logged-in user information
        localStorage.setItem("user", JSON.stringify(data.user));

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
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
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
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          

          <button type="submit" className="signup-submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "16px", fontSize: "14px" }}>
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span
                style={{ color: "#2f7d3c", cursor: "pointer", fontWeight: 600 }}
                onClick={() => onSwitchMode("signup")}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                style={{ color: "#2f7d3c", cursor: "pointer", fontWeight: 600 }}
                onClick={() => onSwitchMode("login")}
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