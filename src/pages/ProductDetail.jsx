import "./ProductDetail.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, getProducts } from "../services/productService";
import { productImages } from "../data/productImages";
import BreadcrumbBar from "../components/BreadcrumbBar";
import Testimonials from "../components/Testimonials";
import NewsletterSection from "../components/NewsletterSection";
import { ShieldCheck, Truck, RotateCcw, Award, Star, ChevronRight, Package, Heart, Share2 } from "lucide-react";

const resolveImage = (img, slug) => {
  if (!img) return null;
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:") || img.startsWith("/")) return img;
  return productImages[img] || productImages[slug] || null;
};

// Strip any currency symbol ($, £, ₹, etc.) and return a clean display string.
// e.g. "$79.00" → "79.00", "₹79" → "79", "79.00" → "79.00"
const cleanPrice = (val) => {
  if (!val) return "";
  const stripped = String(val).replace(/[^\d.]/g, "").trim();
  return stripped || "";
};

// ────────────────────────────────────────────────
// Gallery Component
// ────────────────────────────────────────────────
function Gallery({ images, product }) {
  const allImages = images.filter(Boolean);
  const [selected, setSelected] = useState(allImages[0] || null);

  useEffect(() => {
    setSelected(allImages[0] || null);
  }, [images[0]]);

  return (
    <div className="pd-gallery">
      {/* Badges */}
      <div className="pd-gallery-badges">
        {product.isBestSeller && <span className="pd-badge pd-badge--bestseller">Best Seller</span>}
        {product.salePrice && product.regularPrice && product.salePrice !== product.regularPrice && (
          <span className="pd-badge pd-badge--sale">Sale</span>
        )}
        {product.stockStatus === "Out of Stock" && (
          <span className="pd-badge pd-badge--oos">Out of Stock</span>
        )}
      </div>

      {/* Main Image */}
      <div className="pd-gallery-main">
        {selected ? (
          <img src={selected} alt={product.title} className="pd-gallery-img" />
        ) : (
          <div className="pd-gallery-placeholder">
            <Package size={64} color="#ccc" />
            <p>No image available</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="pd-gallery-thumbs">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(img)}
              className={`pd-gallery-thumb${selected === img ? " active" : ""}`}
            >
              <img src={img} alt={`View ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────
// Star Rating
// ────────────────────────────────────────────────
function StarRating({ rating = 0, reviews = 0 }) {
  return (
    <div className="pd-rating">
      <div className="pd-stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={16}
            fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
            color={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
          />
        ))}
      </div>
      <span className="pd-rating-count">{reviews} reviews</span>
    </div>
  );
}

// ────────────────────────────────────────────────
// Price Block
// ────────────────────────────────────────────────
function PriceBlock({ regularPrice, salePrice, price }) {
  const regClean = cleanPrice(regularPrice);
  const saleClean = cleanPrice(salePrice);
  const priceClean = cleanPrice(price);

  const hasSale = saleClean && regClean && saleClean !== regClean;

  if (hasSale) {
    const reg = parseFloat(regClean);
    const sale = parseFloat(saleClean);
    const discount = reg > 0 ? Math.round(((reg - sale) / reg) * 100) : 0;

    return (
      <div className="pd-price-block">
        <span className="pd-price-sale">${saleClean}</span>
        <span className="pd-price-original">${regClean}</span>
        {discount > 0 && <span className="pd-price-discount">-{discount}%</span>}
      </div>
    );
  }

  const displayPrice = regClean || priceClean;
  return (
    <div className="pd-price-block">
      <span className="pd-price-main">{displayPrice ? `$${displayPrice}` : "Price not set"}</span>
    </div>
  );
}

// ────────────────────────────────────────────────
// Attributes Display
// ────────────────────────────────────────────────
function AttributeRow({ name, values }) {
  return (
    <div className="pd-attr-row">
      <span className="pd-attr-label">{name}</span>
      <div className="pd-attr-values">
        {values.map((v, i) => (
          <span key={i} className="pd-attr-chip">{v}</span>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Variation Selector (Variable products)
// ────────────────────────────────────────────────
function VariationSelector({ attributes, variations, onSelect }) {
  const [selections, setSelections] = useState({});

  const updateSelection = (name, value) => {
    const next = { ...selections, [name]: value };
    setSelections(next);

    // Find matching variation
    const match = variations.find((v) => {
      const combo = v.combination instanceof Map ? Object.fromEntries(v.combination) : v.combination;
      return attributes.every((a) => {
        const chosen = next[a.name];
        return !chosen || combo[a.name] === chosen;
      });
    });
    if (onSelect) onSelect(match || null);
  };

  return (
    <div className="pd-variation-selector">
      {attributes
        .filter((a) => a.usedForVariations && a.values?.length > 0)
        .map((attr) => (
          <div key={attr.name} className="pd-variation-group">
            <label className="pd-variation-label">{attr.name}</label>
            <div className="pd-variation-options">
              {attr.values.map((v) => (
                <button
                  key={v}
                  onClick={() => updateSelection(attr.name, v)}
                  className={`pd-variation-chip${selections[attr.name] === v ? " selected" : ""}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

// ────────────────────────────────────────────────
// Related Product Card
// ────────────────────────────────────────────────
function RelatedCard({ product }) {
  const img = resolveImage(product.image, product.slug);
  const hasSale = product.salePrice && product.regularPrice && product.salePrice !== product.regularPrice;

  return (
    <Link to={`/product/${product.slug}`} className="pd-related-card">
      <div className="pd-related-card-img">
        {img ? (
          <img src={img} alt={product.title} />
        ) : (
          <div className="pd-related-img-placeholder"><Package size={40} color="#ccc" /></div>
        )}
        {product.isBestSeller && <span className="pd-related-badge">Best Seller</span>}
      </div>
      <div className="pd-related-card-body">
        <h4 className="pd-related-title">{product.title}</h4>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="pd-related-price">
          {hasSale ? (
            <>
              <span className="pd-related-sale">${cleanPrice(product.salePrice)}</span>
              <span className="pd-related-original">${cleanPrice(product.regularPrice)}</span>
            </>
          ) : (
            <span className="pd-related-main">${cleanPrice(product.regularPrice || product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ────────────────────────────────────────────────
// Tab Panel
// ────────────────────────────────────────────────
function TabPanel({ product }) {
  const [active, setActive] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    product.specifications?.length > 0 && { id: "specs", label: "Specifications" },
    product.attributes?.filter(a => a.visibleOnProductPage).length > 0 && { id: "attributes", label: "Attributes" },
    { id: "shipping", label: "Shipping & Returns" },
  ].filter(Boolean);

  return (
    <div className="pd-tabs">
      <div className="pd-tabs-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`pd-tab-btn${active === t.id ? " active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pd-tab-content">
        {active === "description" && (
          <div
            className="pd-tab-description"
            dangerouslySetInnerHTML={{
              __html: product.description || product.shortDescription || "<p>No description available.</p>",
            }}
          />
        )}

        {active === "specs" && (
          <table className="pd-specs-table">
            <tbody>
              {product.specifications?.map((s, i) => (
                <tr key={i}>
                  <th>{s.label}</th>
                  <td>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {active === "attributes" && (
          <div className="pd-attrs-list">
            {product.attributes
              ?.filter((a) => a.visibleOnProductPage)
              .map((a, i) => (
                <AttributeRow key={i} name={a.name} values={a.values || []} />
              ))}
          </div>
        )}

        {active === "shipping" && (
          <div className="pd-tab-shipping">
            <div className="pd-shipping-row">
              <Truck size={20} className="pd-shipping-icon" />
              <div>
                <strong>Free Delivery</strong>
                <p>On orders above $50. Delivered within 3–7 business days.</p>
              </div>
            </div>
            <div className="pd-shipping-row">
              <RotateCcw size={20} className="pd-shipping-icon" />
              <div>
                <strong>Easy Returns</strong>
                <p>30-day hassle-free return policy for eligible products.</p>
              </div>
            </div>
            {product.weight > 0 && (
              <div className="pd-shipping-row">
                <Package size={20} className="pd-shipping-icon" />
                <div>
                  <strong>Package Weight</strong>
                  <p>{product.weight} kg</p>
                </div>
              </div>
            )}
            {(product.dimensions?.length > 0 || product.dimensions?.width > 0 || product.dimensions?.height > 0) && (
              <div className="pd-shipping-row">
                <Package size={20} className="pd-shipping-icon" />
                <div>
                  <strong>Dimensions (L × W × H)</strong>
                  <p>
                    {product.dimensions?.length} × {product.dimensions?.width} × {product.dimensions?.height} cm
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Trust Badges
// ────────────────────────────────────────────────
function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, label: "Secure Checkout", sub: "SSL encrypted" },
    { icon: Truck, label: "Fast Shipping", sub: "3–7 business days" },
    { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle-free" },
    { icon: Award, label: "Premium Quality", sub: "Lab tested" },
  ];
  return (
    <div className="pd-trust">
      {badges.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="pd-trust-item">
          <Icon size={22} className="pd-trust-icon" />
          <div>
            <span className="pd-trust-label">{label}</span>
            <span className="pd-trust-sub">{sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────
// Purchase Sidebar
// ────────────────────────────────────────────────
function PurchaseSidebar({ product, selectedVariation }) {
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const isOOS = product.stockStatus === "Out of Stock";
  const isSoldIndividually = product.soldIndividually;
  const isExternal = product.productType === "External";

  const rawPrice = selectedVariation
    ? selectedVariation.salePrice || selectedVariation.price
    : product.salePrice || product.regularPrice || product.price;
  const rawRegular = selectedVariation
    ? selectedVariation.price
    : product.regularPrice;

  const displayPrice = cleanPrice(rawPrice);
  const displayRegular = cleanPrice(rawRegular);

  const hasSale = selectedVariation
    ? cleanPrice(selectedVariation.salePrice) && cleanPrice(selectedVariation.salePrice) !== cleanPrice(selectedVariation.price)
    : cleanPrice(product.salePrice) && cleanPrice(product.regularPrice) && cleanPrice(product.salePrice) !== cleanPrice(product.regularPrice);

  const stockQty = selectedVariation ? selectedVariation.stock : product.stockQuantity;

  return (
    <div className="pd-purchase">
      {/* Price */}
      <div className="pd-purchase-price">
        {displayPrice ? (
          <>
            <span className="pd-purchase-current">${displayPrice}</span>
            {hasSale && displayRegular && <span className="pd-purchase-original">${displayRegular}</span>}
          </>
        ) : (
          <span className="pd-purchase-na">Price not available</span>
        )}
      </div>

      {/* Stock Status */}
      <div className={`pd-stock-status ${isOOS ? "oos" : "in-stock"}`}>
        <span className="pd-stock-dot" />
        {product.stockStatus}
        {product.manageStock && stockQty > 0 && !isOOS && (
          <span className="pd-stock-qty"> — {stockQty} left</span>
        )}
      </div>

      {/* SKU */}
      {(selectedVariation?.sku || product.sku) && (
        <div className="pd-sku">SKU: <strong>{selectedVariation?.sku || product.sku}</strong></div>
      )}

      {/* Qty */}
      {!isExternal && !isOOS && (
        <div className="pd-qty-wrap">
          <label className="pd-qty-label">Quantity</label>
          <div className="pd-qty-controls">
            <button
              className="pd-qty-btn"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
            >−</button>
            <input
              type="number"
              className="pd-qty-input"
              value={qty}
              min={1}
              max={isSoldIndividually ? 1 : undefined}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 1;
                setQty(isSoldIndividually ? 1 : Math.max(1, v));
              }}
            />
            <button
              className="pd-qty-btn"
              onClick={() => setQty((q) => (isSoldIndividually ? 1 : q + 1))}
              disabled={isSoldIndividually && qty >= 1}
            >+</button>
          </div>
          {isSoldIndividually && (
            <p className="pd-qty-note">Limit: 1 per order</p>
          )}
        </div>
      )}

      {/* CTA */}
      {isExternal ? (
        <a
          href={product.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pd-btn-primary"
        >
          {product.buttonText || "Buy Now"}
        </a>
      ) : (
        <>
          <button className="pd-btn-primary" disabled={isOOS}>
            {isOOS ? "Out of Stock" : "Add to Cart"}
          </button>
          <button className="pd-btn-secondary" disabled={isOOS}>
            Buy Now
          </button>
        </>
      )}

      {/* Wishlist / Share */}
      <div className="pd-actions-row">
        <button
          className={`pd-action-btn${wishlist ? " active" : ""}`}
          onClick={() => setWishlist(!wishlist)}
        >
          <Heart size={16} fill={wishlist ? "#ef4444" : "none"} color={wishlist ? "#ef4444" : "currentColor"} />
          {wishlist ? "Wishlisted" : "Wishlist"}
        </button>
        <button className="pd-action-btn">
          <Share2 size={16} />
          Share
        </button>
      </div>

      <TrustBadges />

      {/* Category / Brand */}
      <div className="pd-meta">
        {product.categoryName && (
          <div className="pd-meta-row">
            <span className="pd-meta-label">Category:</span>
            <Link to={`/category/${product.category}`} className="pd-meta-link">{product.categoryName}</Link>
          </div>
        )}
        {product.brand && (
          <div className="pd-meta-row">
            <span className="pd-meta-label">Brand:</span>
            <span className="pd-meta-value">{product.brand}</span>
          </div>
        )}
        {product.sku && (
          <div className="pd-meta-row">
            <span className="pd-meta-label">SKU:</span>
            <span className="pd-meta-value">{product.sku}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────
export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const p = await getProduct(slug);
      setProduct(p);

      if (p) {
        const all = await getProducts();
        const rel = all
          .filter((item) => item.slug !== slug && item.category === p.category)
          .slice(0, 6);
        setRelated(rel);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner" />
        <p>Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <Package size={80} color="#ccc" />
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="pd-btn-primary" style={{ display: "inline-flex", marginTop: "1.5rem" }}>
          Browse Products
        </Link>
      </div>
    );
  }

  // Build image list: featured + gallery
  const featuredImg = resolveImage(product.image, product.slug);
  const galleryImgs = (product.gallery || []).map((g) => resolveImage(g, product.slug)).filter(Boolean);
  const allImages = featuredImg ? [featuredImg, ...galleryImgs] : galleryImgs;

  // Visible attributes
  const visibleAttrs = (product.attributes || []).filter((a) => a.visibleOnProductPage);
  const variationAttrs = (product.attributes || []).filter((a) => a.usedForVariations);

  const isVariable = product.productType === "Variable";
  const isGrouped = product.productType === "Grouped";

  return (
    <>
      <BreadcrumbBar category={product.categoryName} title={product.title} />

      <div className="pd-page">
        {/* ── Top: Gallery / Info / Sidebar ── */}
        <section className="pd-top">
          <div className="pd-container">
            <div className="pd-grid">
              {/* Gallery */}
              <div className="pd-col-gallery">
                <Gallery images={allImages} product={product} />
              </div>

              {/* Info */}
              <div className="pd-col-info">
                {/* Breadcrumb micro */}
                {product.categoryName && (
                  <div className="pd-category-label">
                    <Link to={`/category/${product.category}`}>{product.categoryName}</Link>
                    <ChevronRight size={14} />
                  </div>
                )}

                <h1 className="pd-title">{product.title}</h1>

                <StarRating rating={product.rating} reviews={product.reviews} />

                <PriceBlock
                  regularPrice={product.regularPrice}
                  salePrice={product.salePrice}
                  price={product.price}
                />

                {/* Short description */}
                {product.shortDescription && (
                  <div
                    className="pd-short-desc"
                    dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                  />
                )}

                {/* Variation selector (Variable products) */}
                {isVariable && variationAttrs.length > 0 && (
                  <VariationSelector
                    attributes={variationAttrs}
                    variations={product.variations || []}
                    onSelect={setSelectedVariation}
                  />
                )}

                {/* Visible attributes */}
                {visibleAttrs.length > 0 && !isVariable && (
                  <div className="pd-attrs-inline">
                    {visibleAttrs.map((a, i) => (
                      <AttributeRow key={i} name={a.name} values={a.values || []} />
                    ))}
                  </div>
                )}

                {/* About items */}
                {product.aboutItems?.length > 0 && (
                  <ul className="pd-about-list">
                    {product.aboutItems.map((item, i) => (
                      <li key={i}>
                        <span className="pd-about-dot">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Purchase Sidebar */}
              <div className="pd-col-sidebar">
                <PurchaseSidebar product={product} selectedVariation={selectedVariation} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Tab Panel ── */}
        <section className="pd-tabs-section">
          <div className="pd-container">
            <TabPanel product={product} />
          </div>
        </section>

        {/* ── Grouped Products ── */}
        {isGrouped && product.groupedProducts?.length > 0 && (
          <section className="pd-grouped-section">
            <div className="pd-container">
              <h2 className="pd-section-title">Products in this Group</h2>
              <div className="pd-related-grid">
                {product.groupedProducts.map((gp) => (
                  <RelatedCard key={gp._id || gp} product={gp} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Upsells ── */}
        {product.upsells?.length > 0 && (
          <section className="pd-upsells-section">
            <div className="pd-container">
              <h2 className="pd-section-title">You May Also Like</h2>
              <div className="pd-related-grid">
                {product.upsells.map((up) => (
                  <RelatedCard key={up._id || up} product={up} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="pd-related-section">
            <div className="pd-container">
              <h2 className="pd-section-title">Related Products</h2>
              <div className="pd-related-grid">
                {related.map((item) => (
                  <RelatedCard key={item._id || item.slug} product={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Brand description ── */}
        {product.brandDescription && (
          <section className="pd-brand-section">
            <div className="pd-container">
              <div className="pd-brand-card">
                <h2>About the Brand</h2>
                <p>{product.brandDescription}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── More About Product ── */}
        {product.moreAbout && (
          <section className="pd-more-section">
            <div className="pd-container">
              <div className="pd-more-card">
                <h2>More About This Product</h2>
                <p>{product.moreAbout}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      <Testimonials />
      <NewsletterSection />
    </>
  );
}