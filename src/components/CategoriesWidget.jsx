import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const slugifyCategory = (text) =>
  text.toString().toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .trim();

export default function CategoriesWidget({ categories, activeCategorySlug, title = "Blog Categories" }) {
  const formattedCategories = categories.map(cat => ({
    name: cat.name,
    slug: cat.slug || slugifyCategory(cat.name),
    count: cat.count
  }));

  return (
    <div className="bg-white border border-slate-100 rounded-[18px] p-6 shadow-sm">
      <h3 className="text-[#147a3f] font-bold text-[20px] mb-5">
        {title}
      </h3>
      <ul className="space-y-3.5">
        {formattedCategories.map((category, index) => {
          const isActive = activeCategorySlug === category.slug;
          return (
            <li key={index} className="flex items-center justify-between text-sm">
              <Link
                to={`/blog?category=${category.slug}`}
                className={`font-medium transition hover:text-[#147a3f] ${
                  isActive ? "text-[#147a3f] font-semibold" : "text-slate-700"
                }`}
              >
                {category.name}
              </Link>
              <span className={`text-sm font-medium ${
                isActive ? "text-[#147a3f] font-bold" : "text-slate-500"
              }`}>
                {category.count}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="pt-4 border-t border-slate-100 mt-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#147a3f] hover:text-[#106933] uppercase tracking-wider"
        >
          View All Blogs <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
