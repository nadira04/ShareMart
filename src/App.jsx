import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchSection from "./components/SearchSection";
import Categories from "./components/Categories";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./pages/AdminDashboard";
import DynamicDashboard from "./pages/DynamicDashboard";
import AddProduct from "./pages/AddProduct";
import Marketplace from "./pages/Marketplace";


function App() {
  const [authMode, setAuthMode] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showDashboard, setShowDashboard] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);

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
    setShowDashboard(false);

    showToast("Logout successful!", "success");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="app">
      <Navbar
        onLoginClick={() => setAuthMode("login")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onDashboardClick={() => {
          setShowAddProduct(false);
          setShowMarketplace(false);
          setShowDashboard(true);
        }}
        onHomeClick={() => {
          setShowAddProduct(false);
          setShowMarketplace(false);
          setShowDashboard(false);
        }}
        onMarketplaceClick={() => {
          setShowAddProduct(false);
          setShowDashboard(false);
          setShowMarketplace(true);
        }}
      />
      {showAddProduct ? (
        <AddProduct />
      ) : showMarketplace ? (
        <Marketplace />
      ) : showDashboard &&
        user?.permissions?.includes("role.view") ? (
        <AdminDashboard />
      ) : showDashboard ? (
        <DynamicDashboard
          onAddProduct={() => {
            setShowMarketplace(false);
            setShowAddProduct(true);
          }}
        />
      ) : (
        <>
          <main>
            <Hero />
            <SearchSection />
            <Categories />
            <HowItWorks />
          </main>

          <Footer />
        </>
      )}

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