import {
  ShoppingCart,
  MapPin,
  User,
  ChevronDown,
  Globe,
  Heart,
} from "lucide-react";

function Navbar() {
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

          <div className="logo">
            <div className="logo-icon">♻</div>
            <span>
              Share<span>Mart</span>
            </span>
          </div>

          <div className="nav-links">
            <a className="active">Home</a>
            <a>Donate Food</a>
            <a>Discount Food</a>
            <a>Marketplace</a>
            <a>How It Works</a>
            <a>About Us</a>
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

            <button className="login-btn">
              <User size={18} />
              Login / Sign Up
            </button>

          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;