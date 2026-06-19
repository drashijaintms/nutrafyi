import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { getProducts } from "../services/productService";
import { productImages } from "../data/productImages";

import BreadcrumbBar from "../components/BreadcrumbBar";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import PurchaseBox from "../components/PurchaseBox";
import ProductRecommendations from "../components/ProductRecommendations";
import MoreAboutProduct from "../components/MoreAboutProduct";
import AboutBrand from "../components/AboutBrand";
import Testimonials from "../components/Testimonials";
import BestSellerProducts from "../components/BestSellerProducts";
import NewsletterSection from "../components/NewsletterSection";

function ProductDetail() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
useEffect(() => {
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  fetchProducts();
}, []);
  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        Product Not Found
      </div>
    );
  }

  const recommendedProducts = products
    .filter(
      (item) =>
        item.slug !== slug &&
        item.category === product.category
    )
    .slice(0, 4)
    .map((item) => ({
      image: productImages[item.image],
      name: item.title,
      price: item.price,
      slug: item.slug,
    }));

  return (
    <>
      <BreadcrumbBar
        category={product.categoryName}
        title={product.title}
      />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">

          <div className="grid grid-cols-12 gap-10">

            <div className="col-span-4">
              <ProductGallery
  key={product.slug}
images={[
  productImages[product.image],
  productImages[product.image],
  productImages[product.image],
  productImages[product.image],
]}
/>
            </div>

            <div className="col-span-4">
              <ProductInfo
  title={product.title}
  price={product.price}
  description={product.description}
  specifications={product.specifications}
  aboutItems={product.aboutItems}
  rating={product.rating}
  reviews={product.reviews}
/>
            </div>

            <div className="col-span-4">
              <PurchaseBox
                price={product.price}
              />
            </div>

          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        <ProductRecommendations
          title="Customers Who Viewed This Item Also Viewed"
          products={recommendedProducts}
        />

        <ProductRecommendations
          title="Frequently Bought Together"
          products={recommendedProducts}
        />

        <MoreAboutProduct moreAbout={product.moreAbout}/>

        <AboutBrand brandDescription={product.brandDescription}/>

      </div>

      <Testimonials />

      <BestSellerProducts />

      <NewsletterSection />
    </>
  );
}

export default ProductDetail;