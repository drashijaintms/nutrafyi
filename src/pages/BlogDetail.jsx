import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Calendar, User, ChevronRight, ArrowLeft } from "lucide-react";

function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogAndTrackView = async () => {
      setLoading(true);
      try {
        // 1. Fetch the blog content
        const res = await axios.get(`/api/blogs/${slug}`);
        setBlog(res.data);
        setLoading(false);

        // 2. Increment the view count on hit
        try {
          await axios.post(`/api/blogs/${slug}/view`);
          // Increment locally in state for instant UI update
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading article...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-xl font-bold text-slate-700">Article Not Found</h2>
        <p className="text-slate-500">The article you are looking for does not exist or has been removed.</p>
        <Link
          to="/blog"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link to="/blog" className="hover:text-emerald-600 transition">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-md">{blog.title}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-650 hover:text-emerald-800 transition mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </Link>

        {/* Article Details Container */}
        <article className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          {/* Header Image */}
          {blog.featuredImage && (
            <div className="aspect-[21/9] w-full overflow-hidden border-b border-slate-100">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Category Tag */}
            {blog.categories && blog.categories.length > 0 && (
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                {blog.categories[0]}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
              {blog.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-slate-500 border-y border-slate-100 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-450" />
                <span>By <span className="font-semibold text-slate-700">{blog.author || "Admin"}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-450" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto sm:ml-0">
                <Eye className="w-4 h-4 text-slate-450" />
                <span><span className="font-bold text-slate-800">{blog.views || 0}</span> views</span>
              </div>
            </div>

            {/* Content text */}
            <div 
              className="prose prose-emerald max-w-none text-slate-650 leading-8 text-[16px] sm:text-[18px] space-y-6 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}

export default BlogDetail;