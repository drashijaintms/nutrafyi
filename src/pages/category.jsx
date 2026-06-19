import CategoryBanner from "../components/CategoryBanner";
import BreadcrumbBar from "../components/BreadcrumbBar";
import CategorySidebar from "../components/CategorySidebar";
import CategoryGrid from "../components/CategoryGrid";
function Category() {
  return (
    <>
      <BreadcrumbBar title="All Categories" />

      <CategoryBanner />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex gap-8">

            {/* Left Sidebar */}
            <div className="w-[280px]">
              <CategorySidebar />
            </div>

            {/* Right Content */}
            <div className="flex-1">
               <CategoryGrid />
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

export default Category;