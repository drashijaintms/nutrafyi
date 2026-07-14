import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

function BlogCard({
  image,
  category,
  title,
  date,
  slug,
  excerpt,
  altText,
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/blog/${slug}`}
      className="
        flex
        flex-col
        h-full
        bg-white
        border
        border-[#e5e5e5]
        rounded-[16px]
        overflow-hidden
        hover:shadow-lg
        hover:-translate-y-2
        transition-all
        duration-300
      "
    >
      {/* Image — always show placeholder if missing or broken */}
      {image && !imgError ? (
        <img
          src={image}
          alt={altText || title}
          onError={() => setImgError(true)}
          className="w-full h-[170px] object-cover"
        />
      ) : (
        <div className="w-full h-[170px] bg-[#f0f0f0] flex items-center justify-center">
          <svg className="w-10 h-10 text-[#cccccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">

        {/* Category */}
        <div className="mb-4">
          <span 
            className="font-poppins text-[#137b3a] font-bold text-[13.5px] uppercase tracking-wider border-b-[2px] border-[#137b3a] pb-0.5 inline-block"
          >
            {category}
          </span>
        </div>

        {/* Title + Excerpt in a fixed-start block */}
        <div className="flex-1">
          <h4
            className="font-poppins text-[14px] sm:text-[14.5px] font-semibold leading-[1.4] mb-3 uppercase text-[#111111]"
          >
            {title}
          </h4>

          {excerpt && (
            <p
              className="font-poppins text-[#555555] text-[11.5px] leading-[18px] font-normal uppercase tracking-wide line-clamp-3"
            >
              {excerpt}
            </p>
          )}
        </div>

        {/* Date pinned at bottom — no border line */}
        <div 
          className="font-poppins mt-4 flex items-center gap-2 text-[11px] font-medium text-[#111111] uppercase tracking-wider"
        >
          <Calendar className="w-3.5 h-3.5 text-[#137b3a]" />
          <span>{date}</span>
        </div>

      </div>

    </Link>
  );
}

export default BlogCard;