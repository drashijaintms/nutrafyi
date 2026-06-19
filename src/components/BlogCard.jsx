import { Link } from "react-router-dom";

function BlogCard({
  image,
  category,
  title,
  date,
  slug,
}) {
  return (
    <Link
  to={`/blog/${slug}`}
  className="
    block
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
      <img
        src={image}
        alt={title}
        className="
          w-full
          h-[170px]
          object-cover
        "
      />

      {/* Content */}
      <div className="p-5">

        <h3
          className="
            text-[#147a3f]
            font-bold
            text-[16px]
            uppercase
            mb-3
          "
        >
          {category}
        </h3>

        <h4
          className="
            text-[14px]
            font-semibold
            leading-7
            mb-6
            uppercase
          "
        >
          {title}
        </h4>

        <div className="flex items-center gap-2 text-[12px] text-[#666]">

          <span>📅</span>

          <span>
            {date}
          </span>

        </div>

      </div>

    </Link>
  );
}

export default BlogCard;