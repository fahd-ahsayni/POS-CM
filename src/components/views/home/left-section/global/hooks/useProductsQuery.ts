import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types";

const PRODUCTS_CACHE_TIME = 1000 * 60 * 5; // 5 minutes
const PRODUCTS_STALE_TIME = 1000 * 60 * 1; // 1 minute

export function useProductsQuery() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      const products: Product[] = await response.json();
      return products;
    },
    cacheTime: PRODUCTS_CACHE_TIME,
    staleTime: PRODUCTS_STALE_TIME,
    // Prefetch next page
    onSuccess: (data) => {
      // Implement pagination logic here if needed
    },
  });
}
