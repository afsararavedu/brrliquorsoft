import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertDailySale } from "@shared/schema";

export function useSales() {
  return useQuery({
    queryKey: [api.sales.list.path],
    queryFn: async () => {
      const res = await fetch(api.sales.list.path);
      if (!res.ok) throw new Error("Failed to fetch sales data");
      return api.sales.list.responses[200].parse(await res.json());
    },
  });
}

export function useBulkUpdateSales() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDailySale[]) => {
      const res = await fetch(api.sales.bulkUpdate.path, {
        method: api.sales.bulkUpdate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.sales.bulkUpdate.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to update sales");
      }
      return api.sales.bulkUpdate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sales.list.path] });
    },
  });
}
