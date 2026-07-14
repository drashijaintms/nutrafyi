import "./ProductDetail.css";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct, getProducts } from "../services/productService";
import { productImages } from "../data/productImages";
import BreadcrumbBar from "../components/BreadcrumbBar";
import Testimonials from "../components/Testimonials";
import NewsletterSection from "../components/NewsletterSection";
import { ShieldCheck, Truck, RotateCcw, Award, Star, ChevronRight, Package, Heart, Share2 } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

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
  const allImages = images.filter(Boolean).map(url => ({ type: "image", url }));
  
  const hasVideo = product.videoType && (product.videoUrl || product.videoIframe);
  const mediaItems = [...allImages];
  
  if (hasVideo) {
    mediaItems.push({
      type: "video",
      videoType: product.videoType,
      url: product.videoUrl,
      iframe: product.videoIframe
    });
  }

  const [selected, setSelected] = useState(mediaItems[0] || null);

  useEffect(() => {
    setSelected(mediaItems[0] || null);
  }, [images[0], product.videoType, product.videoUrl, product.videoIframe]);

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

      {/* Main Image or Video */}
      <div className="pd-gallery-main">
        {selected ? (
          selected.type === "image" ? (
            <img src={selected.url} alt={product.title} className="pd-gallery-img" />
          ) : selected.videoType === "url" ? (
            selected.url.toLowerCase().endsWith(".gif") ? (
              <img src={selected.url} alt={product.title} className="pd-gallery-img" />
            ) : (
              <video src={selected.url} controls className="pd-gallery-video" />
            )
          ) : (
            <div 
              className="pd-gallery-iframe-wrapper" 
              dangerouslySetInnerHTML={{ __html: selected.iframe }} 
            />
          )
        ) : (
          <div className="pd-gallery-placeholder">
            <Package size={64} color="#ccc" />
            <p>No image available</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="pd-gallery-thumbs">
          {mediaItems.map((item, i) => {
            const isActive = selected && (
              (item.type === "image" && selected.type === "image" && item.url === selected.url) ||
              (item.type === "video" && selected.type === "video")
            );
            return (
              <button
                key={i}
                onClick={() => setSelected(item)}
                className={`pd-gallery-thumb${isActive ? " active" : ""}`}
              >
                {item.type === "image" ? (
                  <img src={item.url} alt={`View ${i + 1}`} />
                ) : (
                  <div className="pd-gallery-thumb-video-placeholder">
                    <span className="text-lg">▶</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">Video</span>
                  </div>
                )}
              </button>
            );
          })}
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
function PriceBlock({ regularPrice, salePrice, price, currencyOverrides }) {
  const { formatPrice, hasActiveSale, getNumericPrice } = useCurrency();
  const mockProductObj = { price, regularPrice, salePrice, currencyOverrides };
  const hasSale = hasActiveSale(mockProductObj);

  if (hasSale) {
    const reg = getNumericPrice(regularPrice, currencyOverrides, true);
    const sale = getNumericPrice(salePrice, currencyOverrides);
    const discount = reg > 0 ? Math.round(((reg - sale) / reg) * 100) : 0;

    return (
      <div className="pd-price-block">
        <span className="pd-price-sale">{formatPrice(salePrice, currencyOverrides)}</span>
        <span className="pd-price-original">{formatPrice(regularPrice, currencyOverrides, true)}</span>
        {discount > 0 && <span className="pd-price-discount">-{discount}%</span>}
      </div>
    );
  }

  return (
    <div className="pd-price-block">
      <span className="pd-price-main">{formatPrice(regularPrice || price, currencyOverrides)}</span>
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
  const { formatPrice, hasActiveSale } = useCurrency();
  const hasSale = hasActiveSale(product);
  const img = resolveImage(product.image, product.slug);

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
              <span className="pd-related-sale">{formatPrice(product.salePrice, product.currencyOverrides)}</span>
              <span className="pd-related-original">{formatPrice(product.regularPrice || product.price, product.currencyOverrides, true)}</span>
            </>
          ) : (
            <span className="pd-related-main">{formatPrice(product.regularPrice || product.price, product.currencyOverrides)}</span>
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
  const { formatPrice, hasActiveSale, getNumericPrice } = useCurrency();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product || !product._id) return;
      const token = localStorage.getItem("token");
      let wishList = [];
      const wishJson = localStorage.getItem("wishlist_ids");
      
      if (wishJson) {
        wishList = JSON.parse(wishJson);
      } else if (token) {
        try {
          const res = await fetch("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.customer && data.customer.wishlist) {
              const ids = data.customer.wishlist.map(w => w._id || w);
              localStorage.setItem("wishlist_ids", JSON.stringify(ids));
              wishList = ids;
            }
          }
        } catch (err) {
          console.error("Self-heal wishlist fetch error:", err);
        }
      }
      setWishlist(wishList.includes(product._id));
    };

    checkWishlist();

    window.addEventListener("wishlist_updated", checkWishlist);
    window.addEventListener("user_logged_in", checkWishlist);
    window.addEventListener("user_logged_out", checkWishlist);
    
    return () => {
      window.removeEventListener("wishlist_updated", checkWishlist);
      window.removeEventListener("user_logged_in", checkWishlist);
      window.removeEventListener("user_logged_out", checkWishlist);
    };
  }, [product]);

  const handleToggleWishlist = async () => {
    if (!product || !product._id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update wishlist");
      }

      localStorage.setItem("wishlist_ids", JSON.stringify(data.wishlist));
      window.dispatchEvent(new Event("wishlist_updated"));

      triggerToast(wishlist ? "Removed from Wishlist!" : "Added to Wishlist!");

    } catch (err) {
      console.error("Wishlist error:", err);
      triggerToast(err.message || "Error updating wishlist");
    }
  };

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleAddToCart = () => {
    const cartJson = localStorage.getItem("cart_items");
    let items = cartJson ? JSON.parse(cartJson) : [];
    
    const itemId = selectedVariation ? `${product._id}-${selectedVariation.sku}` : product._id;
    const name = selectedVariation 
      ? `${product.title} (${Object.entries(selectedVariation.combination || {}).map(([k,v]) => `${k}: ${v}`).join(", ")})` 
      : product.title;
    
    const rawPrice = selectedVariation
      ? selectedVariation.salePrice || selectedVariation.price
      : product.salePrice || product.regularPrice || product.price;
    const priceVal = getNumericPrice(rawPrice, product.currencyOverrides);
    const imageVal = resolveImage(product.image, product.slug) || "";

    const existing = items.find(item => item.id === itemId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: itemId,
        name,
        price: priceVal,
        qty,
        image: imageVal,
        slug: product.slug,
        currencyOverrides: product.currencyOverrides || {}
      });
    }
    
    localStorage.setItem("cart_items", JSON.stringify(items));
    window.dispatchEvent(new Event("cart_updated"));
    triggerToast(`Added to Cart! (Quantity: ${qty})`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const isOOS = product.stockStatus === "Out of Stock";
  const isSoldIndividually = product.soldIndividually;
  const isExternal = product.productType === "External";

  const rawPrice = selectedVariation
    ? selectedVariation.salePrice || selectedVariation.price
    : product.salePrice || product.regularPrice || product.price;
  const rawRegular = selectedVariation
    ? selectedVariation.price
    : product.regularPrice;

  const mockProductObj = { price: rawRegular, regularPrice: rawRegular, salePrice: rawPrice, currencyOverrides: product.currencyOverrides };
  const hasSale = hasActiveSale(mockProductObj);

  const stockQty = selectedVariation ? selectedVariation.stock : product.stockQuantity;

  return (
    <div className="pd-purchase">
      {/* Price */}
      <div className="pd-purchase-price">
        {rawPrice ? (
          <>
            <span className="pd-purchase-current">{formatPrice(rawPrice, product.currencyOverrides)}</span>
            {hasSale && rawRegular && <span className="pd-purchase-original">{formatPrice(rawRegular, product.currencyOverrides, true)}</span>}
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
          target="_self"
          className="pd-btn-primary"
          style={{ display: "block", textAlign: "center" }}
        >
          {product.buttonText || "Buy Now"}
        </a>
      ) : (
        <>
          <button
            className="pd-btn-primary"
            disabled={isOOS}
            onClick={handleAddToCart}
          >
            {isOOS ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            className="pd-btn-secondary"
            disabled={isOOS}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </>
      )}

      {/* Wishlist / Share */}
      <div className="pd-actions-row">
        <button
          className={`pd-action-btn${wishlist ? " active" : ""}`}
          onClick={handleToggleWishlist}
        >
          <Heart size={16} fill={wishlist ? "#ef4444" : "none"} color={wishlist ? "#ef4444" : "currentColor"} />
          {wishlist ? "Wishlisted" : "Wishlist"}
        </button>
        <button
          className="pd-action-btn"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            triggerToast("Product link copied!");
          }}
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      {toast.show && (
        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-800 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
        </div>
      )}

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
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaqIndex(prev => prev === idx ? null : idx);
  };

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

  useEffect(() => {
    if (product) {
      // Update document title
      document.title = product.seo?.metaTitle || product.title;

      // Update description meta tag
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', product.seo?.metaDescription || product.title);

      // Update keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      if (product.seo?.metaKeywords && product.seo.metaKeywords.length > 0) {
        metaKeywords.setAttribute('content', product.seo.metaKeywords.join(', '));
      } else {
        metaKeywords.setAttribute('content', "");
      }

      // Update canonical link tag
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', product.seo?.canonicalUrl || window.location.href);

      // ── Schema Injection ──────────────────────────────────────────────
      // Each schema type gets its own <script type="application/ld+json"> tag.
      // They all COEXIST in the <head> — Google supports multiple JSON-LD blocks per page.
      // We use [data-product-schema] to track every script we inject so we can
      // cleanly remove them all on unmount / product change without touching
      // any pre-existing schemas added by other parts of the app.

      // 1. First remove any schemas we previously injected for this product page
      document.querySelectorAll("script[data-product-schema]").forEach(el => el.remove());

      const injectSchema = (type, payload) => {
        const script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-product-schema", type);   // track, not replace
        script.textContent = typeof payload === "string" ? payload : JSON.stringify(payload);
        document.head.appendChild(script);
      };

      // 2. FAQ Schema — auto-generated from product.faqs array
      if (product.faqs && product.faqs.length > 0) {
        injectSchema("faq", {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": product.faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        });
      }

      // 3. Brand Schema — auto-generated from product.brandInfo
      if (product.brandInfo) {
        const b = product.brandInfo;
        const sameAs = [
          b.socialLinks?.facebook,
          b.socialLinks?.instagram,
          b.socialLinks?.linkedin,
          b.socialLinks?.twitter,
        ].filter(Boolean);
        injectSchema("brand", {
          "@context": "https://schema.org",
          "@type": "Brand",
          "name": b.name,
          ...(b.websiteUrl   && { "url": b.websiteUrl }),
          ...(b.logo         && { "logo": b.logo }),
          ...(b.description  && { "description": b.description }),
          ...(b.contactEmail && { "email": b.contactEmail }),
          ...(b.contactNumber && { "telephone": b.contactNumber }),
          ...(sameAs.length  > 0 && { "sameAs": sameAs }),
        });
      }

      // 4. Custom Schema Override — appended ALONGSIDE the auto-generated schemas,
      //    not instead of them. The admin can paste any valid JSON-LD here
      //    (e.g. a Product, Organization, or Review schema) and it will live
      //    as its own separate <script> tag in the head.
      if (product.schemaOverride && product.schemaOverride.trim()) {
        injectSchema("custom-override", product.schemaOverride.trim());
      }
    }

    // Cleanup: remove all schemas we injected when the component unmounts
    // or before the effect re-runs for a different product.
    return () => {
      document.querySelectorAll("script[data-product-schema]").forEach(el => el.remove());
    };
  }, [product]);

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
                  currencyOverrides={product.currencyOverrides}
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

        {/* ── FAQs Section ── */}
        {product.faqs && product.faqs.length > 0 && (
          <section className="pd-faq-section">
            <div className="pd-faq-container">
              <h2 className="pd-section-title">Frequently Asked Questions</h2>
              <div className="pd-faq-accordion">
                {product.faqs.map((faq, idx) => {
                  const isOpen = activeFaqIndex === idx;
                  return (
                    <div key={idx} className="pd-faq-item">
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                        className="pd-faq-trigger"
                      >
                        <span>{faq.question}</span>
                        <span className="pd-faq-icon">{isOpen ? "−" : "+"}</span>
                      </button>
                      <div className={`pd-faq-content-wrapper ${isOpen ? "open" : ""}`}>
                        <div className="pd-faq-content-inner">
                          <div className="pd-faq-content">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── Brand Information Section ── */}
      {product.brandInfo && (
        <section className="pd-brand-info-section">
          <div className="pd-brand-info-container">
            <h2 className="pd-section-title" style={{ marginBottom: "1.5rem" }}>About the Brand</h2>
            <div className="pd-brand-info-card">
              {/* Header: Logo + Name + Website */}
              <div className="pd-brand-info-header">
                {product.brandInfo.logo && (
                  <div className="pd-brand-logo-wrap">
                    <img
                      src={product.brandInfo.logo}
                      alt={product.brandInfo.logoAltText || product.brandInfo.name}
                    />
                  </div>
                )}
                <div className="pd-brand-info-name-wrap">
                  <h3>{product.brandInfo.name}</h3>
                  {product.brandInfo.websiteUrl && (
                    <p>{new URL(product.brandInfo.websiteUrl).hostname}</p>
                  )}
                </div>
                {product.brandInfo.websiteUrl && (
                  <a
                    href={product.brandInfo.websiteUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="pd-brand-website-link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                    Visit Website
                  </a>
                )}
                {/* Know More — opens dedicated brand page */}
                {(product.brandInfo.slug || product.brandInfo.name) && (
                  <Link
                    to={`/brands/${product.brandInfo.slug || product.brandInfo.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")}`}
                    className="pd-brand-website-link"
                    style={{ borderColor: "#147a3f", color: "#147a3f", background: "transparent" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    Know More
                  </Link>
                )}
              </div>

              {/* Body */}
              <div className="pd-brand-info-body">
                {product.brandInfo.description && (
                  <p className="pd-brand-description">{product.brandInfo.description}</p>
                )}

                {/* Contact Info */}
                {(product.brandInfo.contactEmail || product.brandInfo.contactNumber) && (
                  <div className="pd-brand-contact-block">
                    <h4>Contact</h4>
                    {product.brandInfo.contactEmail && (
                      <a href={`mailto:${product.brandInfo.contactEmail}`} className="pd-brand-contact-row">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        {product.brandInfo.contactEmail}
                      </a>
                    )}
                    {product.brandInfo.contactNumber && (
                      <a href={`tel:${product.brandInfo.contactNumber}`} className="pd-brand-contact-row">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12.1 19.79 19.79 0 0 1 1 3.38 2 2 0 0 1 2.96 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 14.76z"/></svg>
                        {product.brandInfo.contactNumber}
                      </a>
                    )}
                  </div>
                )}

                {/* Social Links */}
                {(product.brandInfo.socialLinks?.facebook || product.brandInfo.socialLinks?.instagram ||
                  product.brandInfo.socialLinks?.linkedin || product.brandInfo.socialLinks?.twitter) && (
                  <div className="pd-brand-social-block">
                    <h4>Follow Us</h4>
                    <div className="pd-brand-social-icons">
                      {product.brandInfo.socialLinks?.facebook && (
                        <a href={product.brandInfo.socialLinks.facebook} target="_blank" rel="noreferrer" className="pd-brand-social-icon" title="Facebook">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                      )}
                      {product.brandInfo.socialLinks?.instagram && (
                        <a href={product.brandInfo.socialLinks.instagram} target="_blank" rel="noreferrer" className="pd-brand-social-icon" title="Instagram">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                      )}
                      {product.brandInfo.socialLinks?.linkedin && (
                        <a href={product.brandInfo.socialLinks.linkedin} target="_blank" rel="noreferrer" className="pd-brand-social-icon" title="LinkedIn">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                      )}
                      {product.brandInfo.socialLinks?.twitter && (
                        <a href={product.brandInfo.socialLinks.twitter} target="_blank" rel="noreferrer" className="pd-brand-social-icon" title="Twitter / X">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <Testimonials />
      <NewsletterSection />
    </>
  );
}