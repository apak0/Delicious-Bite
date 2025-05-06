import { useEffect, useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../components/ui/Toast";
import { Plus, Filter, Search, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available: boolean;
}

export default function ProductManagementPage() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Get unique categories from products for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    products.forEach((product) => uniqueCategories.add(product.category));
    return Array.from(uniqueCategories).sort();
  }, [products]);

  // Filter and sort products based on user selections
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Apply search term filter
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Apply category filter
        const matchesCategory =
          categoryFilter === "all" || product.category === categoryFilter;

        // Apply availability filter
        const matchesAvailability =
          availabilityFilter === "all" ||
          (availabilityFilter === "available" && product.available) ||
          (availabilityFilter === "unavailable" && !product.available);

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        // Apply sorting
        switch (sortBy) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [products, searchTerm, categoryFilter, availabilityFilter, sortBy]);

  // Count products by availability status
  const productCounts = useMemo(() => {
    return {
      total: products.length,
      available: products.filter((p) => p.available).length,
      unavailable: products.filter((p) => !p.available).length,
    };
  }, [products]);

  // Form handling
  const handleAddProduct = async (productData: Omit<Product, "id">) => {
    try {
      await addProduct(productData);
      showToast("Product added successfully!", "success");
      setIsFormOpen(false);
    } catch (err) {
      showToast("Failed to add product", "error");
      console.error("Failed to add product:", err);
    }
  };

  const handleUpdateProduct = async (
    id: string,
    productData: Partial<Product>
  ) => {
    try {
      await updateProduct(id, productData);
      showToast("Product updated successfully!", "success");
      setEditingProduct(null);
    } catch (err) {
      showToast("Failed to update product", "error");
      console.error("Failed to update product:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        await deleteProduct(id);
        showToast("Product deleted successfully", "success");
      } catch (err) {
        showToast("Failed to delete product", "error");
        console.error("Failed to delete product:", err);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  // Content to display based on loading/error state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-lg inline-block">
            <p className="text-red-800">Error loading products: {error}</p>
            <Button variant="outline" className="mt-3" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="mt-1 text-gray-600">
            Add, edit and manage your restaurant menu items
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Add New Item
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">
            {productCounts.total}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-green-600">Available</p>
          <p className="text-2xl font-bold text-gray-900">
            {productCounts.available}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Unavailable</p>
          <p className="text-2xl font-bold text-gray-900">
            {productCounts.unavailable}
          </p>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable Only</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
              </select>
            </div>

            <Button
              variant="outline"
              onClick={handleRefresh}
              title="Refresh Product List"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              onEdit={() => handleEditProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ||
            categoryFilter !== "all" ||
            availabilityFilter !== "all"
              ? "Try adjusting your filters or search term"
              : "Add your first menu item to get started"}
          </p>
          {(searchTerm ||
            categoryFilter !== "all" ||
            availabilityFilter !== "all") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setAvailabilityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add New Menu Item"
        size="xl"
        fullHeight={true}
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Menu Item"
        size="xl"
        fullHeight={true}
      >
        {editingProduct && (
          <ProductForm
            initialData={editingProduct}
            onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export { ProductManagementPage };
