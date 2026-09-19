import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchSection from "./components/SearchSection";
import Categories from "./components/Categories";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";

function App() {
  const [authMode, setAuthMode] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAuthMode(null);

    showToast("Login successful!", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    showToast("Logout successful!", "success");
  };

  return (
    <div className="app">

      <Navbar
        onLoginClick={() => setAuthMode("login")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <main>
        <Hero />
        <SearchSection />
        <Categories />
        <HowItWorks />
      </main>

      <Footer />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={(newMode) => setAuthMode(newMode)}
          onSuccess={(message, type) => {
            if (type === "success" && authMode === "login") {
              handleLoginSuccess();
            } else {
              showToast(message, type);
            }
          }}
        />
      )}

      {toastMessage && (
        <div className={`success-toast ${toastType}`}>
          <span className="toast-icon">
            {toastType === "success" ? "✓" : "×"}
          </span>

          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;