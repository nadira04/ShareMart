import {
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

function Footer() {
  return (
    <footer>

      <div className="container footer-grid">

        <div className="footer-brand">

          <h2>
            Share<span>Mart</span>
          </h2>

          <p>
            A community platform for sharing food,
            reducing waste, and giving products a
            second life.
          </p>

          <strong>
            <Heart size={16} fill="currentColor" />
            Share more. Waste less.
          </strong>

        </div>


        <div>

          <h3>Quick Links</h3>

          <a>Donate Food</a>
          <a>Discount Food</a>
          <a>Marketplace</a>
          <a>How It Works</a>

        </div>


        <div>

          <h3>Community</h3>

          <a>About ShareMart</a>
          <a>Become a Donor</a>
          <a>Partner With Us</a>
          <a>Help Center</a>

        </div>


        <div>

          <h3>Contact Us</h3>

          <p>
            <Mail size={16} />
            nadira.nasir04@gmail.com
          </p>

          <p>
            <Phone size={16} />
            +8801796047492
          </p>

          <p>
            <MapPin size={16} />
            Bangladesh
          </p>

        </div>

      </div>


      <div className="footer-bottom">

        <div className="container">

          <span>
            © 2026 ShareMart. All rights reserved.
          </span>

          <span>
            Designed for a better tomorrow 🌱
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;