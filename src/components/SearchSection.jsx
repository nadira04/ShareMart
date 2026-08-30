import {
  Search,
  Grid2X2,
  MapPin,
  Heart,
  Tag,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";

function SearchSection() {
  return (
    <section className="search-section">

      <div className="container search-container">

        <div className="search-main">

          <button className="category-select">
            <Grid2X2 size={18} />
            All Categories
            <ChevronDown size={16} />
          </button>

          <div className="search-input">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search for food, items or categories..."
            />

            <button>
              <Search size={18} />
              Search
            </button>
          </div>

        </div>


        <div className="search-filters">

          <button>
            <MapPin />
            Nearby
          </button>

          <button>
            <Heart />
            Food Donation
          </button>

          <button>
            <Tag />
            Discount Food
          </button>

          <button>
            <ShoppingBag />
            Marketplace
          </button>

        </div>

      </div>

    </section>
  );
}

export default SearchSection;