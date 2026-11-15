
function Categories({ onCategorySelect, onViewAll, onDonateClick, onDiscountClick }) {

  const categories = [
    {
      title: "Donate Food",
      text: "Share happiness",
      count: "125+ donations today",
      image:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433",
      action: onDonateClick,
    },
    {
      title: "Discount Food",
      text: "Save more, waste less",
      count: "320+ offers",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e",
      action: onDiscountClick,
    },
    {
      title: "Electronics",
      text: "Find great deals",
      count: "450+ items",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661",
      action: () => onCategorySelect?.("Electronics"),
    },
    {
      title: "Home & Living",
      text: "Quality items for your home",
      count: "380+ items",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      action: () => onCategorySelect?.("Home & Living"),
    },
    {
      title: "Fashion",
      text: "Trendy second-hand looks",
      count: "520+ items",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050",
      action: () => onCategorySelect?.("Fashion"),
    },
    {
      title: "Books & Media",
      text: "Books, CDs, and more",
      count: "250+ items",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      action: () => onCategorySelect?.("Books & Media"),
    },
  ];

  return (
    <section className="categories-section">

      <div className="container">

        <div className="section-header">

          <div>
            <span className="section-label">EXPLORE</span>
            <h2>Browse Categories</h2>
          </div>

          <button
            className="view-all"
            type="button"
            onClick={onViewAll}
          >
            View all →
          </button>

        </div>

        <div className="categories-grid">

          {categories.map((category, index) => (

            <div
              className="category-card"
              key={index}
              role="button"
              tabIndex={0}
              onClick={category.action}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  category.action?.();
                }
              }}
            >

              <div className="category-text">

                <h3>{category.title}</h3>

                <p>{category.text}</p>

                <span>{category.count}</span>

              </div>

              <img
                src={category.image}
                alt={category.title}
              />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Categories;
