import {
  ShoppingCart,
  MapPin,
  User,
  ChevronDown,
  Globe,
  Heart,
} from "lucide-react";

function Navbar({ onLoginClick, isLoggedIn, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar-content">
          <span>
            <Heart size={14} fill="white" />
            Together, we can reduce waste and create a better tomorrow.
          </span>

          <div className="top-links">
            <span>Track Order</span>
            <span>Help Center</span>

            <span>
              <Globe size={14} />
              English
              <ChevronDown size={14} />
            </span>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container nav-content">

          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">♻</div>

            <span>
              Share<span>Mart</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <a className="active">Home</a>
            <a>Donate Food</a>
            <a>Discount Food</a>
            <a>Marketplace</a>
            <a>How It Works</a>
            <a>About Us</a>
          </div>

          {/* Right Side Actions */}
          <div className="nav-actions">

            {/* Location */}
            <button className="location-btn">
              <MapPin size={16} />
              Dhaka, Bangladesh
              <ChevronDown size={15} />
            </button>

            {/* Cart */}
            <button className="cart-btn">
              <ShoppingCart size={21} />
              <span className="cart-number">2</span>
            </button>

            {/* Login / Logout */}
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
                className="login-btn"
                onClick={onLogout}
              >
                <User size={18} />
                {user?.name || "User"} | Logout
              </button>
            )}

          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;