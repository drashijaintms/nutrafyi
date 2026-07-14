import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FileText } from "lucide-react";
import headingLeaf from "../assets/heading-leaf.png";

export default function PageDetail() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`/api/pages/${slug}`);
        if (res.data) {
          setPage(res.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error loading dynamic page:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  useEffect(() => {
    if (page) {
      document.title = page.seo?.metaTitle || `${page.title} | NutraFYI`;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', page.seo?.metaDescription || page.title);

      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', page.seo?.canonicalUrl || window.location.href);
    }
  }, [page]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] font-['Poppins']">
        <div className="w-8 h-8 border-4 border-[#147a3f] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm mt-4 font-semibold">Loading Page...</p>
      </div>
    );
  }

  if (error || !page || page.status !== "Published") {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 font-['Poppins'] flex flex-col items-center">
        <FileText size={72} className="text-slate-300 stroke-[1.5] mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The page you're looking for doesn't exist or is not published yet.</p>
        <Link to="/" className="bg-[#147a3f] hover:bg-[#106933] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="py-16 bg-[#fafaf7] min-h-[500px]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Page Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={headingLeaf} alt="leaf decorative" className="w-10" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              {page.title}
            </h1>
            <img src={headingLeaf} alt="leaf decorative" className="w-10 flipped" style={{ transform: "scaleX(-1)" }} />
          </div>
          <div className="w-24 h-1 bg-[#147a3f] mx-auto rounded-full mt-4"></div>
        </header>

        {/* Page Content */}
        <div 
          className="bg-white border border-[#e5e5db] rounded-[24px] p-8 md:p-12 shadow-sm font-['Poppins'] text-slate-700 text-sm md:text-[15px] leading-relaxed prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </article>
  );
}
