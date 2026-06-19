import { Search, UserRound, ShoppingCart } from "lucide-react";

function BreadcrumbBar({ title, category }) {
  return (
    <section className="bg-white shadow-sm border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 py-3">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* Breadcrumb */}
          <div>
            <p className="text-[18px] text-[#222]">

  Home

  {category && (
    <>
      <span className="mx-2">/</span>
      {category}
    </>
  )}

  {title && (
    <>
      <span className="mx-2">/</span>
      {title}
    </>
  )}

</p>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Product Search"
                className="
                  w-[280px]
                  h-[42px]
                  bg-[#f5f7f6]
                  rounded-md
                  pl-4
                  pr-10
                  text-sm
                  outline-none
                  border border-transparent
                  focus:border-[#147a3f]
                "
              />

              <Search
                size={18}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />
            </div>

            {/* User */}
            <button className="text-gray-600 hover:text-[#147a3f] transition">
              <UserRound size={22} />
            </button>

            {/* Cart */}
            <button className="text-gray-600 hover:text-[#147a3f] transition">
              <ShoppingCart size={22} />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default BreadcrumbBar;