import {
  HeartHandshake,
  Percent,
  ShoppingBag,
  ArrowRight,
  Leaf,
  Users,
  Package,
  MapPin,
} from "lucide-react";

function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">

        <div className="hero-content">

          <h1>
            Share More.
            <br />
            Waste Less.
            <br />
            <span>Impact Lives.</span>
          </h1>

          <p>
            Donate surplus food, grab it at a discount, or buy & sell
            second-hand items. Together, we build a better community.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              <HeartHandshake size={20} />
              Donate Food
            </button>

            <button className="secondary-btn">
              <ShoppingBag size={20} />
              Explore Marketplace
            </button>

          </div>

          <div className="hero-stats">

            <div>
              <Users />
              <div>
                <strong>12K+</strong>
                <span>Meals Donated</span>
              </div>
            </div>

            <div>
              <HeartHandshake />
              <div>
                <strong>850+</strong>
                <span>Happy Donors</span>
              </div>
            </div>

            <div>
              <Package />
              <div>
                <strong>5K+</strong>
                <span>Items Sold</span>
              </div>
            </div>

            <div>
              <MapPin />
              <div>
                <strong>20K+</strong>
                <span>People Impacted</span>
              </div>
            </div>

          </div>

        </div>

        <div className="hero-image">

          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433"
            alt="Food donation"
          />

          <div className="food-saved">
            <div className="leaf-circle">
              <Leaf size={24} />
            </div>

            <div>
              <span>Food Saved</span>
              <strong>15,230 kg</strong>
            </div>
          </div>

          <div className="community-box">
            <div className="avatars">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div>
              <strong>Join 20K+ users</strong>
              <span>making an impact daily</span>
            </div>
          </div>

        </div>

        <div className="hero-options">

          <div className="option-card donate-card">

            <div className="option-icon green">
              <HeartHandshake />
            </div>

            <div className="option-content">
              <h3>Donate Food</h3>
              <p>Help NGOs and people in need by donating surplus food.</p>
            </div>

            <div className="option-image">
            </div>

            <button>
              <ArrowRight size={18} />
            </button>

          </div>


          <div className="option-card discount-card">

            <div className="option-icon orange">
              <Percent />
            </div>

            <div className="option-content">
              <h3>Discount Food</h3>
              <p>Grab quality food at discount before it expires.</p>
            </div>

            <div className="option-image">
            </div>

            <button>
              <ArrowRight size={18} />
            </button>

          </div>


          <div className="option-card market-card">

            <div className="option-icon blue">
              <ShoppingBag />
            </div>

            <div className="option-content">
              <h3>Second-hand Marketplace</h3>
              <p>Buy or sell pre-loved items and give them a second life.</p>
            </div>

            <div className="option-image">
            </div>

            <button>
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;