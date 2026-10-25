
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
import DonorDashboard from "./pages/DonorDashboard";
import AddProduct from "./pages/AddProduct";
import Marketplace from "./pages/Marketplace";
import AddDonation from "./pages/AddDonation";
import DonationPage from "./pages/DonationPage";
import MyRequests from "./pages/MyRequests";

function App() {
  const [authMode, setAuthMode] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showDashboard, setShowDashboard] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [showDonationPage, setShowDonationPage] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);

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
    setShowAddProduct(false);
    setShowAddDonation(false);
    setShowMarketplace(false);
    setShowDonationPage(false);
    setShowMyRequests(false);

    showToast("Logout successful!", "success");
  };

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Could not read saved user:", error);
  }

  const goHome = () => {
    setShowAddProduct(false);
    setShowAddDonation(false);
    setShowMarketplace(false);
    setShowDonationPage(false);
    setShowMyRequests(false);
    setShowDashboard(false);
  };

  const goToDashboard = () => {
    setShowAddProduct(false);
    setShowAddDonation(false);
    setShowMarketplace(false);
    setShowDonationPage(false);
    setShowMyRequests(false);
    setShowDashboard(true);
  };

  const goToDonations = () => {
    setShowAddProduct(false);
    setShowAddDonation(false);
    setShowMarketplace(false);
    setShowMyRequests(false);
    setShowDashboard(false);
    setShowDonationPage(true);
  };

  const goToMyRequests = () => {
    setShowAddProduct(false);
    setShowAddDonation(false);
    setShowMarketplace(false);
    setShowDonationPage(false);
    setShowDashboard(false);
    setShowMyRequests(true);
  };

  return (
    <div className="app">
      <Navbar
        onLoginClick={() => setAuthMode("login")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onDashboardClick={goToDashboard}
        onHomeClick={goHome}
        onMarketplaceClick={() => {
          setShowAddProduct(false);
          setShowAddDonation(false);
          setShowDashboard(false);
          setShowDonationPage(false);
          setShowMyRequests(false);
          setShowMarketplace(true);
        }}
        onDonatedItemClick={goToDonations}
      />

      {showMyRequests ? (
        <MyRequests onBack={goToDashboard} />
      ) : showDonationPage ? (
        <DonationPage />
      ) : showAddDonation ? (
        <AddDonation
          onBack={goToDashboard}
          onSuccess={goToDashboard}
        />
      ) : showAddProduct ? (
        <AddProduct />
      ) : showMarketplace ? (
        <Marketplace />
      ) : showDashboard && user?.permissions?.includes("role.view") ? (
        <AdminDashboard />
      ) : showDashboard &&
        user?.roles?.some((role) =>
          (typeof role === "string" ? role : role.name)
            ?.toLowerCase()
            .includes("donor")
        ) ? (
        <DonorDashboard
          onAddProduct={() => {
            setShowDashboard(false);
            setShowMarketplace(false);
            setShowAddProduct(false);
            setShowAddDonation(true);
          }}
          onLogout={handleLogout}
        />
      ) : showDashboard ? (
        <DynamicDashboard
          onAddProduct={() => {
            setShowDashboard(false);
            setShowMarketplace(false);
            setShowDonationPage(false);
            setShowMyRequests(false);
            setShowAddProduct(true);
          }}
          onViewDonations={goToDonations}
          onViewMyRequests={goToMyRequests}
          onCreateDonation={() => {
            setShowDashboard(false);
            setShowMarketplace(false);
            setShowDonationPage(false);
            setShowMyRequests(false);
            setShowAddDonation(true);
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
