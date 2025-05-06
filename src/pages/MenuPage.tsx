import { useState, useMemo, useEffect } from "react";
import { Search, ShoppingBag } from "lucide-react";
import MenuItemCard, { MenuItemCardSkeleton } from "../components/MenuItemCard";
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

      return matchesSearch && matchesCategory && product.available;
    });
  }, [products, searchTerm, selectedCategory]);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Show skeleton only on initial load
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-200 rounded animate-pulse"
                  />
                ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <MenuItemCardSkeleton key={index} />
                ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

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
            Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                fullWidth
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Categories
            </h3>
            <div className="space-y-2">
              {loading
                ? // Skeleton loaders for categories
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="h-10 bg-gray-200 rounded-md animate-pulse"
                      />
                    ))
                : categories.map((category) => (
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

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <MenuItemCardSkeleton key={index} />
                ))}
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
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <MenuItemCard key={product.id} product={product} />
                ))}
              </div>

              {!loading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No menu items found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Shopping Cart */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}
