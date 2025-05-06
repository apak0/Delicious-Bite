import { createContext, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*");

      if (fetchError) throw new Error(fetchError.message);

      setProducts(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching products"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularProducts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("price", { ascending: false })
        .limit(10);

      if (fetchError) throw new Error(fetchError.message);
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

      if (insertError) throw new Error(insertError.message);

      setProducts((prev) => [...prev, data]);
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

      if (updateError) throw new Error(updateError.message);

      setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
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

      if (deleteError) throw new Error(deleteError.message);

      setProducts((prev) => prev.filter((p) => p.id !== id));
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
