import BreadcrumbBar from "../components/BreadcrumbBar";
import CategorySidebar from "../components/CategorySidebar";
import ProductsGrid from "../components/ProductsGrid";

function Products() {
  return (
    <>
      <BreadcrumbBar title="All Products" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex gap-8">

            <div className="w-[280px]">
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