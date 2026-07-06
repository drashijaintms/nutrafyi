import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Eye, 
  Calendar, 
  User, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight
} from "lucide-react";
import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaEnvelope, 
  FaLink,
  FaLeaf
} from "react-icons/fa";

// Import local author profile images for beautiful widgets
import authorProfile from "../assets/testimonials/emily-johnson.png";
import ctaSupplements from "../assets/category/weight-management.jpg";
import CategoriesWidget from "../components/CategoriesWidget";

function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Table of Contents & FAQs Accordion state
  const [toc, setToc] = useState([]);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [instagramCopied, setInstagramCopied] = useState(false);

  // Load individual blog and track view
  useEffect(() => {
    const loadBlogAndTrackView = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blogs/${slug}`);
        setBlog(res.data);
        setLoading(false);

        // Increment view count on hit
        try {
          await axios.post(`/api/blogs/${slug}/view`);
          setBlog(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : null);
        } catch (viewErr) {
          console.error("Failed to increment views:", viewErr);
        }
      } catch (error) {
        console.error("Error loading blog details:", error);
        setLoading(false);
      }
    };

    if (slug) {
      loadBlogAndTrackView();
    }
  }, [slug]);

  // Load all blogs for sidebar (Categories, Popular Posts, Next/Prev)
  useEffect(() => {
    const fetchBlogsList = async () => {
      try {
        const res = await axios.get("/api/blogs");
        if (res.data) {
          setBlogsList(res.data);
        }
      } catch (err) {
        console.error("Error fetching blogs list:", err);
      }
    };
    fetchBlogsList();
  }, []);

  // Parse headings for Table of Contents (h1, h2, h3)
  useEffect(() => {
    if (blog && blog.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(blog.content, "text/html");
      const headings = doc.querySelectorAll("h1, h2, h3");
      const tocItems = Array.from(headings).map((heading) => {
        const text = heading.textContent.trim();
        const id = text
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "");
        return {
          id,
          text,
          level: heading.tagName.toLowerCase(), // "h1", "h2", or "h3"
        };
      });
      setToc(tocItems);
    }
  }, [blog]);

  // Auto-inject FAQ Schema markup in HTML head (combining backend FAQs and editor inline FAQs)
  useEffect(() => {
    if (blog) {
      const inlineFaqs = [];
      if (blog.content) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(blog.content, "text/html");
          const items = doc.querySelectorAll(".faq-accordion-item");
          items.forEach((item) => {
            const questionEl = item.querySelector(".faq-accordion-trigger span:first-child");
            const answerEl = item.querySelector(".faq-accordion-content");
            if (questionEl && answerEl) {
              inlineFaqs.push({
                question: questionEl.textContent.trim(),
                answer: answerEl.textContent.trim()
              });
            }
          });
        } catch (err) {
          console.error("Failed to parse inline FAQs for schema:", err);
        }
      }

      const dbFaqs = blog.faqs || [];
      const combinedFaqs = [...dbFaqs, ...inlineFaqs];

      if (combinedFaqs.length > 0) {
        // Create script tag
        const script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("id", "faq-page-jsonld");

        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": combinedFaqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

        script.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(script);

        return () => {
          const existingScript = document.getElementById("faq-page-jsonld");
          if (existingScript) {
            existingScript.remove();
          }
        };
      }
    }
  }, [blog]);

  // Delegated click handler for inline FAQs inserted into the TinyMCE rich editor
  useEffect(() => {
    if (blog && blog.content) {
      const handleAccordionClick = (e) => {
        const trigger = e.target.closest(".faq-accordion-trigger");
        if (trigger) {
          e.preventDefault();
          const item = trigger.closest(".faq-accordion-item");
          if (item) {
            const content = item.querySelector(".faq-accordion-content");
            const icon = trigger.querySelector(".faq-accordion-icon");
            if (content) {
              const isHidden = content.style.display === "none" || !content.style.display;
              if (isHidden) {
                content.style.display = "block";
                if (icon) icon.textContent = "−";
              } else {
                content.style.display = "none";
                if (icon) icon.textContent = "+";
              }
            }
          }
        }
      };

      const contentContainer = document.querySelector(".blog-rich-content");
      if (contentContainer) {
        contentContainer.addEventListener("click", handleAccordionClick);
      }

      return () => {
        if (contentContainer) {
          contentContainer.removeEventListener("click", handleAccordionClick);
        }
      };
    }
  }, [blog]);

  // Copy link helper
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Instagram: copy link + open Instagram
  const handleInstagramShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setInstagramCopied(true);
    setTimeout(() => {
      setInstagramCopied(false);
      window.open("https://www.instagram.com", "_blank");
    }, 1200);
  };

  // Smooth scroll handler
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Inject anchor IDs into headings inside raw content
  const getProcessedContent = () => {
    if (!blog || !blog.content) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, "text/html");
    const headings = doc.querySelectorAll("h3, h2");
    headings.forEach((heading) => {
      const text = heading.textContent;
      const id = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      heading.setAttribute("id", id);
    });
    return doc.body.innerHTML;
  };

  // Toggle FAQ Accordion Index
  const toggleFaq = (idx) => {
    setActiveFaqIndex(prev => prev === idx ? null : idx);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fdfdfc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#147a3f] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold text-[#147a3f]">Loading article...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fdfdfc] gap-4">
        <h2 className="text-xl font-bold text-slate-700">Article Not Found</h2>
        <p className="text-slate-500">The article you are looking for does not exist or has been removed.</p>
        <Link
          to="/blog"
          className="flex items-center gap-2 px-6 py-3 bg-[#147a3f] hover:bg-[#106933] text-white rounded-xl font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  // Next / Prev pagination calculations
  const currentIndex = blogsList.findIndex(b => b.slug === slug);
  const prevBlog = currentIndex > 0 ? blogsList[currentIndex - 1] : null;
  const nextBlog = currentIndex < blogsList.length - 1 && currentIndex !== -1 ? blogsList[currentIndex + 1] : null;

  // Sidebar: Compute Categories — use only primary (first) category per blog, same as BlogListing
  const categoryCounts = blogsList.reduce((acc, b) => {
    const primaryCat = (b.categories && b.categories.length > 0)
      ? b.categories[0]
      : "General";
    acc[primaryCat] = (acc[primaryCat] || 0) + 1;
    return acc;
  }, {});

  const sidebarCategories = Object.keys(categoryCounts)
    .map(name => ({ name, count: categoryCounts[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const slugifyCategory = (text) =>
    text.toString().toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();

  // Sidebar: Popular posts (sorted by views)
  const popularBlogs = [...blogsList]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  return (
    <div className="bg-[#fdfdfc] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#147a3f] transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-300" />
          <Link to="/blog" className="hover:text-[#147a3f] transition">Wellness Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-300" />
          <span className="text-[#147a3f]">
            {blog.categories && blog.categories.length > 0 ? blog.categories[0] : "General"}
          </span>
        </div>

        {/* 2-Column Mockup Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Main Blog Post Content */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="w-full overflow-hidden rounded-[24px] border border-slate-100 shadow-xs">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-auto object-cover max-h-[480px]"
                />
              </div>
            )}

            {/* Table of Contents Widget — collapsible */}
            {toc.length > 0 && (() => {
              // Compute hierarchical numbering: 1, 1.1, 1.1.1
              const counters = { h1: 0, h2: 0, h3: 0 };
              const numbered = toc.map((item) => {
                if (item.level === "h1") {
                  counters.h1 += 1;
                  counters.h2 = 0;
                  counters.h3 = 0;
                  return { ...item, number: `${counters.h1}` };
                } else if (item.level === "h2") {
                  counters.h2 += 1;
                  counters.h3 = 0;
                  const prefix = counters.h1 > 0 ? `${counters.h1}.${counters.h2}` : `${counters.h2}`;
                  return { ...item, number: prefix };
                } else {
                  counters.h3 += 1;
                  const prefix =
                    counters.h1 > 0 && counters.h2 > 0
                      ? `${counters.h1}.${counters.h2}.${counters.h3}`
                      : counters.h2 > 0
                      ? `${counters.h2}.${counters.h3}`
                      : `${counters.h3}`;
                  return { ...item, number: prefix };
                }
              });

              return (
                <div
                  className="border border-[#d4e6da] rounded-[16px] overflow-hidden"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {/* Header bar — always visible, click to toggle */}
                  <button
                    onClick={() => setTocOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-[#f0f7f2] hover:bg-[#e6f2ea] transition-colors duration-200"
                  >
                    <span className="flex items-center gap-2.5 text-[15px] font-bold text-[#0e3b20]">
                      <svg className="w-4 h-4 text-[#147a3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                      </svg>
                      Table of Contents
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#147a3f] transition-transform duration-300 ${tocOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expandable content */}
                  {tocOpen && (
                    <div className="bg-white px-5 py-4 border-t border-[#d4e6da]">
                      <ul className="list-none m-0 p-0">
                        {numbered.map((item, idx) => {
                          const isH1 = item.level === "h1";
                          const isH2 = item.level === "h2";
                          const isH3 = item.level === "h3";
                          return (
                            <li key={idx} className="my-0">
                              <button
                                onClick={() => scrollToHeading(item.id)}
                                className="w-full text-left py-[5px] flex items-start gap-2 group hover:text-[#147a3f] transition-colors duration-150"
                                style={{
                                  paddingLeft: isH1 ? "0px" : isH2 ? "20px" : "44px",
                                }}
                              >
                                {/* Number badge */}
                                <span
                                  className={`shrink-0 font-bold tabular-nums ${
                                    isH1
                                      ? "text-[#147a3f] text-[13.5px]"
                                      : isH2
                                      ? "text-[#1a5c33] text-[13px]"
                                      : "text-[#888] text-[12px]"
                                  }`}
                                >
                                  {item.number}.
                                </span>
                                {/* Label */}
                                <span
                                  className={`group-hover:text-[#147a3f] ${
                                    isH1
                                      ? "text-[14px] font-bold text-[#0e3b20]"
                                      : isH2
                                      ? "text-[13.5px] font-semibold text-[#1a5c33]"
                                      : "text-[13px] font-medium text-[#666]"
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}


            {/* Category Pill Tag */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="pt-2">
                <span className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-[#147a3f] text-white uppercase tracking-wider">
                  {blog.categories[0]}
                </span>
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#0e3b20] leading-tight">
              {blog.title}
            </h1>

            {/* Author Meta Details Bar */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-slate-500 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <img
                  src={authorProfile}
                  alt="Author Profile"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="block text-slate-400 text-[11px] uppercase font-bold tracking-wider">Author</span>
                  <span className="font-bold text-slate-800 text-sm">
                    By {blog.author || "Sophia Reynolds"} • <span className="text-slate-500 font-medium">Nutrition Expert</span>
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-600">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-440" />
                <span className="font-semibold text-slate-600">
                  <span className="font-bold text-slate-800">{blog.views || 0}</span> views
                </span>
              </div>
            </div>

            {/* Dynamic CTA Callout Box Option (Matches Screenshot Mockup) */}
            {blog.ctaBox && blog.ctaBox.show && blog.ctaBox.text && (
              <div className="flex items-start gap-4 p-5 my-6 bg-[#f5f8f4] border-l-4 border-[#147a3f] rounded-r-2xl shadow-2xs animate-in fade-in duration-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e8f1e5] text-[#147a3f] flex-shrink-0 mt-0.5">
                  <FaLeaf className="w-5 h-5" />
                </div>
                <p className="text-slate-800 italic font-semibold text-[17px] sm:text-[18px] leading-7 m-0">
                  {blog.ctaBox.text}
                </p>
              </div>
            )}

            {/* Render HTML content containing blockquotes, custom lists, header typography */}
            <div 
              className="blog-rich-content max-w-none text-slate-700 leading-8 text-[16px] sm:text-[18px] space-y-6"
              dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
            />

            {/* FAQs Accordion Feature Section */}
            {blog.faqs && blog.faqs.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-slate-100 text-left animate-in fade-in duration-300">
                <h3 className="text-2xl font-bold font-serif text-[#0e3b20] mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {blog.faqs.map((faq, idx) => {
                    const isOpen = activeFaqIndex === idx;
                    return (
                      <div key={idx} className="border border-slate-150 rounded-2xl overflow-hidden bg-white shadow-2xs hover:border-[#147a3f]/30 transition duration-200">
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 text-[16px] sm:text-[17px] hover:text-[#147a3f] transition bg-[#fafafa] cursor-pointer group"
                        >
                          <span className="pr-4">{faq.question}</span>
                          <span className="text-[#147a3f] text-lg font-black transition-transform duration-200 shrink-0">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="p-5 bg-white border-t border-slate-100 text-slate-600 text-sm sm:text-[15px] leading-7 animate-in fade-in duration-350">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2">Tags:</span>
                {blog.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3.5 py-1.5 bg-[#f5f8f4] border border-[#e8f1e5] rounded-full text-xs font-semibold text-[#147a3f]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Sharing Bar */}
            <div className="flex items-center gap-3 py-6 border-y border-slate-100">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2">Share this article:</span>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#147a3f] hover:text-white hover:border-[#147a3f] transition-all"
                title="Share on Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>

              {/* X (Twitter) */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#147a3f] hover:text-white hover:border-[#147a3f] transition-all"
                title="Share on X (Twitter)"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram — copies link + opens Instagram (no web share API exists) */}
              <div className="relative">
                <button
                  onClick={handleInstagramShare}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    instagramCopied
                      ? "bg-[#147a3f] text-white border-[#147a3f]"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-[#147a3f] hover:text-white hover:border-[#147a3f]"
                  }`}
                  title="Share on Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </button>
                {instagramCopied && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#0e3b20] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md">
                    Link copied! Opening Instagram…
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0e3b20]" />
                  </div>
                )}
              </div>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent("Check out this article: " + window.location.href)}`}
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#147a3f] hover:text-white hover:border-[#147a3f] transition-all"
                title="Share via Email"
              >
                <FaEnvelope className="w-4 h-4" />
              </a>

              {/* Copy link */}
              <div className="relative">
                <button
                  onClick={handleCopyLink}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    linkCopied
                      ? "bg-[#147a3f] text-white border-[#147a3f]"
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-[#147a3f] hover:text-white hover:border-[#147a3f]"
                  }`}
                  title="Copy link"
                >
                  <FaLink className="w-4 h-4" />
                </button>
                {linkCopied && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#0e3b20] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md">
                    Link copied!
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0e3b20]" />
                  </div>
                )}
              </div>
            </div>


            {/* Pagination Prev/Next Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {/* Prev Blog Link */}
              {prevBlog ? (
                <Link 
                  to={`/blog/${prevBlog.slug}`}
                  className="flex flex-col p-5 border border-slate-100 hover:border-[#147a3f] rounded-2xl bg-white shadow-2xs hover:shadow-xs transition group text-left"
                >
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Article
                  </span>
                  <span className="text-slate-800 font-bold text-sm sm:text-base mt-2 group-hover:text-[#147a3f] transition line-clamp-2">
                    {prevBlog.title}
                  </span>
                </Link>
              ) : <div />}

              {/* Next Blog Link */}
              {nextBlog ? (
                <Link 
                  to={`/blog/${nextBlog.slug}`}
                  className="flex flex-col p-5 border border-slate-100 hover:border-[#147a3f] rounded-2xl bg-white shadow-2xs hover:shadow-xs transition group text-right items-end"
                >
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    Next Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-slate-800 font-bold text-sm sm:text-base mt-2 group-hover:text-[#147a3f] transition line-clamp-2">
                    {nextBlog.title}
                  </span>
                </Link>
              ) : <div />}
            </div>

          </main>

          {/* RIGHT COLUMN: Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Widget 1: About the Author */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                About the Author
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={authorProfile}
                  alt="Author Sophia Reynolds"
                  className="w-16 h-16 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-slate-800 font-bold text-base">Sophia Reynolds</h4>
                  <span className="text-xs font-semibold text-[#147a3f] uppercase tracking-wider">Nutrition Expert</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-6">
                Sophia is a certified nutritionist with over 8 years of experience in holistic health and wellness. She specializes in creating actionable, realistic diet plans.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#instagram" className="text-slate-400 hover:text-[#147a3f] transition">
                  <FaInstagram className="w-4.5 h-4.5" />
                </a>
                <a href="#linkedin" className="text-slate-400 hover:text-[#147a3f] transition">
                  <FaLinkedin className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Widget 2: Categories — dynamic from real blog data */}
            <CategoriesWidget
              categories={sidebarCategories}
              title="Categories"
            />


            {/* Widget 3: Popular Posts */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                Popular Posts
              </h3>
              <ul className="space-y-4.5">
                {popularBlogs.length > 0 ? (
                  popularBlogs.map((popBlog, idx) => (
                    <li key={idx} className="flex gap-3.5 items-start group">
                      <Link 
                        to={`/blog/${popBlog.slug}`}
                        className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100"
                      >
                        <img
                          src={popBlog.featuredImage || authorProfile}
                          alt={popBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250"
                        />
                      </Link>
                      <div className="space-y-1.5">
                        <Link 
                          to={`/blog/${popBlog.slug}`}
                          className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight hover:text-[#147a3f] transition"
                        >
                          {popBlog.title}
                        </Link>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {new Date(popBlog.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No popular posts available.</p>
                )}
              </ul>
            </div>

            {/* Widget 4: Wellness Starts with Nature CTA Banner */}
            <div 
              style={{ backgroundImage: `linear-gradient(rgba(20, 122, 63, 0.95), rgba(16, 105, 51, 0.95)), url(${ctaSupplements})` }}
              className="rounded-3xl p-8 bg-cover bg-center text-white text-center space-y-5 shadow-sm relative overflow-hidden"
            >
              <h3 className="text-xl font-bold font-serif leading-tight">
                Wellness Starts with Nature
              </h3>
              <p className="text-xs text-emerald-100 leading-6">
                Discover science-backed premium organic supplements designed to support your body's health and performance every single day.
              </p>
              <Link 
                to="/shop" 
                className="inline-block bg-white text-[#147a3f] hover:bg-emerald-50 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Shop Now
              </Link>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}

export default BlogDetail;