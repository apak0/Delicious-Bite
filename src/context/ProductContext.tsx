import { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { DbProduct } from "../types";

interface ProductContextType {
  products: DbProduct[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchPopularProducts: () => Promise<DbProduct[]>;
  addProduct: (product: Omit<DbProduct, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<DbProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined
);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true); // Initialize as true
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchProducts = async () => {
    if (!isInitialized) {
      setLoading(true);
    }

    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*");

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setProducts(data || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching products"
      );
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("price", { ascending: false })
        .limit(10);

      if (fetchError) {
        setError(fetchError.message);
        return [];
      }

      setError(null);
      return data || [];
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch popular products"
      );
      return [];
    }
  };

  const addProduct = async (product: Omit<DbProduct, "id">) => {
    try {
      setError(null);
      const { data, error: insertError } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setProducts((prev) => [...prev, data]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
      throw new Error("Failed to add product");
    }
  };

  const updateProduct = async (id: string, product: Partial<DbProduct>) => {
    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      throw new Error("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      throw new Error("Failed to delete product");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        fetchPopularProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
