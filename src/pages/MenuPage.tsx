import { useState, useMemo, useEffect } from "react";
import { Search, ShoppingBag } from "lucide-react";
import MenuItemCard from "../components/MenuItemCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useProducts } from "../hooks/useProducts";
import { useOrders } from "../hooks/useOrders";
import { ShoppingCart } from "../components/ShoppingCart";

export function MenuPage() {
  const { products, fetchProducts, loading, error } = useProducts();
  const { cart } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const allCategories = products.map((product) => product.category);
    return ["All", ...new Set(allCategories)];
  }, [products]);

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" ||
        selectedCategory === "All" ||
        product.category === selectedCategory;

      // Only show available products to customers
      return matchesSearch && matchesCategory && product.available;
    });
  }, [products, searchTerm, selectedCategory]);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-gray-600 mt-2">
            Explore our delicious offerings prepared by our expert chefs
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            <span>Cart ({cartItemsCount})</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar */}
        <div className="bg-white p-4 rounded-lg shadow h-fit">
          <div className="mb-6">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="search"
                placeholder="Search dishes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(category === "All" ? "" : category)
                  }
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    (category === "All" && selectedCategory === "") ||
                    category === selectedCategory
                      ? "bg-red-50 text-red-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
              <p className="ml-3 text-gray-600">Loading menu items...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">Error loading menu: {error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => fetchProducts()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <MenuItemCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-lg font-medium text-gray-900">
                No items found
              </h2>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shopping Cart */}
      {isCartOpen && (
        <ShoppingCart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </main>
  );
}
