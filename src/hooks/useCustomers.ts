import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCustomersStats() {
  return useQuery({
    queryKey: ["customers-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, total_orders, total_spent");

      if (error) throw error;

      const total = data?.length || 0;
      const totalSpent = data?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0;
      const totalOrders = data?.reduce((sum, c) => sum + (c.total_orders || 0), 0) || 0;

      return { total, totalSpent, totalOrders };
    },
  });
}
