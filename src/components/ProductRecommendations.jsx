import ProductCard from "./ProductCard";

function ProductRecommendations({
  title,
  products,
}) {
  return (
    <section className="mt-16">

      <h2
        className="
          text-[28px]
          font-bold
          uppercase
          mb-8
        "
      >
        {title}
      </h2>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          xl:grid-cols-6
          gap-6
        "
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.slug}
            image={product.image}
            name={product.name || product.title}
            price={product.price}
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
            slug={product.slug}
            isBestSeller={product.isBestSeller}
            badge={product.badge}
            rating={product.rating}
            reviews={product.reviews}
          />
        ))}
      </div>

    </section>
  );
}

export default ProductRecommendations;