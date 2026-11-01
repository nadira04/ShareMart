
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
import AddDiscountProduct from "./pages/AddDiscountProduct";
import Marketplace from "./pages/Marketplace";
import DiscountPage from "./pages/DiscountPage";

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
  const [showAddDiscountProduct, setShowAddDiscountProduct] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showDiscountPage, setShowDiscountPage] = useState(false);
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
    resetPages();

    showToast("Logout successful!", "success");
  };

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Could not read saved user:", error);
  }

  const resetPages = () => {
    setShowDashboard(false);
    setShowAddProduct(false);
    setShowAddDiscountProduct(false);
    setShowMarketplace(false);
    setShowDiscountPage(false);
    setShowAddDonation(false);
    setShowDonationPage(false);
    setShowMyRequests(false);
  };

  const goHome = () => {
    resetPages();
  };

  const goToDashboard = () => {
    resetPages();
    setShowDashboard(true);
  };

  const goToDonations = () => {
    resetPages();
    setShowDonationPage(true);
  };

  const goToMyRequests = () => {
    resetPages();
    setShowMyRequests(true);
  };

  const goToMarketplace = () => {
    resetPages();
    setShowMarketplace(true);
  };

  const goToDiscountPage = () => {
    resetPages();
    setShowDiscountPage(true);
  };

  const goToAddDiscountProduct = () => {
    resetPages();
    setShowAddDiscountProduct(true);
  };

  return (
    <div className="app">
      <Navbar
        onLoginClick={() => setAuthMode("login")}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onDashboardClick={goToDashboard}
        onHomeClick={goHome}
        onMarketplaceClick={goToMarketplace}
        onDiscountClick={goToDiscountPage}
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
      ) : showAddDiscountProduct ? (
        <AddDiscountProduct onBack={goToDashboard} />
      ) : showDiscountPage ? (
        <DiscountPage />
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
            resetPages();
            setShowAddDonation(true);
          }}
          onLogout={handleLogout}
        />
      ) : showDashboard ? (
        <DynamicDashboard
          onAddProduct={() => {
            resetPages();
            setShowAddProduct(true);
          }}
          onAddDiscountProduct={goToAddDiscountProduct}
          onViewDonations={goToDonations}
          onViewMyRequests={goToMyRequests}
          onCreateDonation={() => {
            resetPages();
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
