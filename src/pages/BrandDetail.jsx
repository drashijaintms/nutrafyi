import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBrandBySlug } from "../services/brandService";
import { getProducts } from "../services/productService";
import { productImages } from "../data/productImages";
import BreadcrumbBar from "../components/BreadcrumbBar";
import ProductCard from "../components/ProductCard";
import NewsletterSection from "../components/NewsletterSection";
import "./BrandDetail.css";

const resolveProductImage = (img, slug) => {
  if (!img) return null;
  if (img.trim().startsWith("<iframe") || img.trim().startsWith("<div") || img.includes("</iframe>")) {
    return null;
  }
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/")) {
    return img;
  }
  return productImages[img] || productImages[slug] || img;
};

const resolveImage = (img, slug) => {
  if (img && img.startsWith("http")) return img;
  if (img && img.startsWith("/uploads")) return img;
  try {
    return resolveProductImage(slug) || img;
  } catch {
    return img;
  }
};

const SOCIAL_ICONS = {
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

export default function BrandDetail() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [brandData, allProducts] = await Promise.all([
        getBrandBySlug(slug),
        getProducts(),
      ]);
      setBrand(brandData);

      // Filter products belonging to this brand
      if (brandData) {
        const brandProducts = allProducts.filter(
          (p) =>
            p.brand &&
            (p.brand.toLowerCase() === brandData.name.toLowerCase() ||
              p.brand.toLowerCase().replace(/\s+/g, "-") === slug)
        );
        setProducts(brandProducts);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  // Inject brand schema
  useEffect(() => {
    if (!brand) return;
    const sameAs = [
      brand.socialLinks?.facebook,
      brand.socialLinks?.instagram,
      brand.socialLinks?.linkedin,
      brand.socialLinks?.twitter,
    ].filter(Boolean);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Brand",
      name: brand.name,
      ...(brand.websiteUrl && { url: brand.websiteUrl }),
      ...(brand.logo && { logo: brand.logo }),
      ...(brand.description && { description: brand.description }),
      ...(brand.contactEmail && { email: brand.contactEmail }),
      ...(brand.contactNumber && { telephone: brand.contactNumber }),
      ...(sameAs.length > 0 && { sameAs }),
    };
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-brand-page-schema", "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    document.title = `${brand.name} — NutraFYI`;

    return () => {
      document.querySelectorAll("script[data-brand-page-schema]").forEach((el) => el.remove());
    };
  }, [brand]);

  if (loading) {
    return (
      <div className="bd-loading">
        <div className="bd-spinner" />
        <p>Loading brand…</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="bd-not-found">
        <h1>Brand not found</h1>
        <Link to="/products">← Browse all products</Link>
      </div>
    );
  }

  const socialLinks = Object.entries(brand.socialLinks || {}).filter(([, v]) => v);

  return (
    <>
      <BreadcrumbBar
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Brands", to: "/brands" },
          { label: brand.name },
        ]}
      />

      {/* ── Hero ── */}
      <section className="bd-hero">
        <div className="bd-container">
          <div className="bd-hero-inner">
            {brand.logo && (
              <div className="bd-hero-logo">
                <img src={brand.logo} alt={brand.logoAltText || brand.name} />
              </div>
            )}
            <div className="bd-hero-text">
              <h1 className="bd-hero-title">{brand.name}</h1>
              {brand.websiteUrl && (
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="bd-hero-url"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
                  </svg>
                  {new URL(brand.websiteUrl).hostname}
                </a>
              )}
              {brand.description && (
                <p className="bd-hero-desc">{brand.description}</p>
              )}

              {/* Contact row */}
              <div className="bd-contact-row">
                {brand.contactEmail && (
                  <a href={`mailto:${brand.contactEmail}`} className="bd-contact-pill">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    {brand.contactEmail}
                  </a>
                )}
                {brand.contactNumber && (
                  <a href={`tel:${brand.contactNumber}`} className="bd-contact-pill">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12.1 19.79 19.79 0 0 1 1 3.38 2 2 0 0 1 2.96 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 14.76z" />
                    </svg>
                    {brand.contactNumber}
                  </a>
                )}
              </div>

              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <div className="bd-social-row">
                  {socialLinks.map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="bd-social-icon"
                      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                      {SOCIAL_ICONS[platform]}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="bd-products-section">
        <div className="bd-container">
          <div className="bd-products-header">
            <div>
              <h2 className="bd-products-title">Products by {brand.name}</h2>
              <p className="bd-products-count">
                {products.length === 0
                  ? "No products found for this brand yet."
                  : `${products.length} product${products.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
            <Link to="/products" className="bd-browse-all">
              Browse All Products →
            </Link>
          </div>

          {products.length > 0 && (
            <div className="bd-products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={resolveProductImage(product.image, product.slug)}
                  imageAltText={product.imageAltText}
                  name={product.title}
                  price={product.price}
                  regularPrice={product.regularPrice}
                  salePrice={product.salePrice}
                  slug={product.slug}
                  isBestSeller={product.isBestSeller}
                  badge={product.badge}
                  rating={product.rating}
                  reviews={product.reviews}
                  currencyOverrides={product.currencyOverrides}
                  productType={product.productType}
                  externalUrl={product.externalUrl}
                  buttonText={product.buttonText}
                />
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="bd-empty">
              <p>No products have been tagged with this brand yet.</p>
              <Link to="/products" className="bd-browse-all">Browse all products</Link>
            </div>
          )}
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
