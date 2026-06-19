import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Manage Categories
      </h1>

      <p className="mb-4">
        Total Categories: {categories.length}
      </p>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">

          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">
                Title
              </th>

              <th className="p-3 text-left">
                Slug
              </th>

              <th className="p-3 text-left">
                Count
              </th>
            </tr>
          </thead>

          <tbody>

            {categories.map((category) => (
              <tr
                key={category._id}
                className="border-t"
              >
                <td className="p-3">
                  {category.title}
                </td>

                <td className="p-3">
                  {category.slug}
                </td>

                <td className="p-3">
                  {category.count}
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Categories;