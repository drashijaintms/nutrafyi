import BreadcrumbBar from "../components/BreadcrumbBar";
import CategorySidebar from "../components/CategorySidebar";
import ProductsGrid from "../components/ProductsGrid";

function Products() {
  return (
    <>
      <BreadcrumbBar title="All Products" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex flex-col lg:flex-row gap-8">

            <div className="w-full lg:w-[280px] shrink-0">
              <CategorySidebar />
            </div>

            <div className="flex-1">
              <ProductsGrid />
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

export default Products;