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
      {/* Image */}
      {image && !imgError && (
        <img
          src={image}
          alt={title}
          onError={() => setImgError(true)}
          className="
            w-full
            h-[170px]
            object-cover
          "
        />
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">

        {/* Category */}
        <div>
          <span 
            className="text-[#137b3a] font-bold text-[13.5px] uppercase tracking-wider border-b-[2px] border-[#137b3a] pb-0.5 inline-block mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {category}
          </span>
        </div>

        {/* Title */}
        <h4
          className="
            text-[14px]
            sm:text-[14.5px]
            font-extrabold
            leading-[1.4]
            mb-3
            uppercase
            text-[#111111]
          "
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {title}
        </h4>

        {/* Excerpt Paragraph */}
        {excerpt && (
          <p
            className="
              text-[#555555]
              text-[11.5px]
              leading-[18px]
              font-medium
              uppercase
              tracking-wide
              mb-5
              line-clamp-3
            "
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {excerpt}
          </p>
        )}

        {/* Date Aligned at bottom */}
        <div 
          className="mt-auto pt-4 border-t border-[#e5e5db]/60 flex items-center gap-2 text-[11px] font-bold text-[#111111] uppercase tracking-wider"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <Calendar className="w-3.5 h-3.5 text-[#137b3a]" />
          <span>{date}</span>
        </div>

      </div>

    </Link>
  );
}

export default BlogCard;