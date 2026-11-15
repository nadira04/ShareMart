
import { useState } from "react";

import {
  Search,
  Grid2X2,
  MapPin,
  Heart,
  Tag,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";

function SearchSection({
  onSearch,
  onMarketplaceClick,
  onDonationClick,
  onDiscountClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    onSearch?.(searchTerm.trim(), selectedCategory);
  };

  return (
    <section className="search-section">

      <div className="container search-container">

        <form className="search-main" onSubmit={handleSearch}>

          <div className="category-select">
            <Grid2X2 size={18} />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Select category"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Fashion">Fashion</option>
              <option value="Books & Media">Books & Media</option>
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="search-input">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search for food, items or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button type="submit">
              <Search size={18} />
              Search
            </button>

          </div>

        </form>

        <div className="search-filters">

          <button
            type="button"
            onClick={onMarketplaceClick}
          >
            <MapPin />
            Nearby
          </button>

          <button
            type="button"
            onClick={onDonationClick}
          >
            <Heart />
            Food Donation
          </button>

          <button
            type="button"
            onClick={onDiscountClick}
          >
            <Tag />
            Discount Food
          </button>

          <button
            type="button"
            onClick={onMarketplaceClick}
          >
            <ShoppingBag />
            Marketplace
          </button>

        </div>

      </div>

    </section>
  );
}

export default SearchSection;
