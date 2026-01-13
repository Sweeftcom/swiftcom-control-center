import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders_sweeftcom"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

export function useOrders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders_sweeftcom")
        .select(`
          *,
          customer:customers(id, full_name, phone, email),
          vendor:vendors(id, store_name, phone, address),
          driver:drivers(id, full_name, phone, vehicle_number)
        `)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders_sweeftcom" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const updateData: Partial<Order> = { status };
      
      // Add timestamps based on status
      if (status === "accepted") updateData.accepted_at = new Date().toISOString();
      if (status === "picked_up") updateData.picked_up_at = new Date().toISOString();
      if (status === "delivered") updateData.delivered_at = new Date().toISOString();
      if (status === "cancelled") updateData.cancelled_at = new Date().toISOString();

      const { error } = await supabase
        .from("orders_sweeftcom")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: (error) => {
      toast.error("Failed to update order: " + error.message);
    },
  });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, driverId }: { orderId: string; driverId: string }) => {
      const { error } = await supabase
        .from("orders_sweeftcom")
        .update({ driver_id: driverId })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Driver assigned successfully");
    },
    onError: (error) => {
      toast.error("Failed to assign driver: " + error.message);
    },
  });
}

export function useTodayOrdersStats() {
  return useQuery({
    queryKey: ["orders-stats-today"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("orders_sweeftcom")
        .select("id, status, total_amount, delivery_fee, platform_fee, driver_earnings")
        .gte("created_at", today.toISOString());

      if (error) throw error;

      const totalOrders = data?.length || 0;
      const deliveredOrders = data?.filter(o => o.status === "delivered") || [];
      const cancelledOrders = data?.filter(o => o.status === "cancelled") || [];
      const pendingOrders = data?.filter(o => o.status === "pending") || [];

      const revenue = deliveredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const platformFees = deliveredOrders.reduce((sum, o) => sum + (o.platform_fee || 0), 0);
      const driverPayouts = deliveredOrders.reduce((sum, o) => sum + (o.driver_earnings || 0), 0);
      const cancellationRate = totalOrders > 0 ? (cancelledOrders.length / totalOrders) * 100 : 0;

      return {
        totalOrders,
        deliveredCount: deliveredOrders.length,
        pendingCount: pendingOrders.length,
        cancelledCount: cancelledOrders.length,
        revenue,
        platformFees,
        driverPayouts,
        cancellationRate: cancellationRate.toFixed(1),
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
