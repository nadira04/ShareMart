
import { useState } from "react";

import {
  ShoppingCart,
  MapPin,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

function Navbar({
  activePage,
  onLoginClick,
  isLoggedIn,
  onLogout,
  onDashboardClick,
  onHomeClick,
  onMarketplaceClick,
  onDonatedItemClick,
  onDiscountClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Could not read saved user:", error);
  }

  const handleNavigation = (callback) => {
    callback?.();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">

        <div
          className="logo"
          onClick={() => handleNavigation(onHomeClick)}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-icon">♻</div>

          <span>
            Share<span>Mart</span>
          </span>
        </div>

        <div className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>

          <a
            className={activePage === "home" ? "active" : ""}
            onClick={() => handleNavigation(onHomeClick)}
          >
            Home
          </a>

          <a
            className={activePage === "donations" ? "active" : ""}
            onClick={() => handleNavigation(onDonatedItemClick)}
          >
            Donated Item
          </a>

          <a
            className={activePage === "discount" ? "active" : ""}
            onClick={() => handleNavigation(onDiscountClick)}
          >
            Discount Item
          </a>

          <a
            className={activePage === "marketplace" ? "active" : ""}
            onClick={() => handleNavigation(onMarketplaceClick)}
          >
            Marketplace
          </a>

          <a
            onClick={() => {
              handleNavigation(onHomeClick);
              setTimeout(() => {
                document.querySelector(".how-section")?.scrollIntoView({
                  behavior: "smooth",
                });
              }, 100);
            }}
          >
            How It Works
          </a>

          <a
            onClick={() => handleNavigation(onHomeClick)}
          >
            About Us
          </a>

          {isLoggedIn && (
            <a
              className={activePage === "dashboard" ? "active" : ""}
              onClick={() => handleNavigation(onDashboardClick)}
            >
              Dashboard
            </a>
          )}

          {isLoggedIn && (
            <button
              className="mobile-logout-btn"
              onClick={() => {
                onLogout?.();
                setMenuOpen(false);
              }}
            >
              <User size={18} />
              {user?.name || "User"} | Logout
            </button>
          )}

        </div>

        <div className="nav-actions">

          <button className="location-btn">
            <MapPin size={16} />
            Dhaka, Bangladesh
            <ChevronDown size={15} />
          </button>

          <button className="cart-btn">
            <ShoppingCart size={21} />
            <span className="cart-number">2</span>
          </button>

          {!isLoggedIn ? (
            <button
              className="login-btn"
              onClick={onLoginClick}
            >
              <User size={18} />
              Login / Sign Up
            </button>
          ) : (
            <button
              className="login-btn desktop-login-btn"
              onClick={onLogout}
            >
              <User size={18} />
              {user?.name || "User"} | Logout
            </button>
          )}

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
