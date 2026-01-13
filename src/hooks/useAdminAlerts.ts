import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

export function useAdminAlerts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_alerts")
        .select("*")
        .eq("is_resolved", false)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription for alerts
  useEffect(() => {
    const channel = supabase
      .channel("admin-alerts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "admin_alerts" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["admin-alerts"] });
          
          // Show toast for new alerts
          if (payload.eventType === "INSERT") {
            const alert = payload.new as { title: string; severity: string };
            toast.warning(alert.title, {
              description: `New ${alert.severity} alert`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from("admin_alerts")
        .update({ 
          is_resolved: true, 
          resolved_at: new Date().toISOString() 
        })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-alerts"] });
      toast.success("Alert resolved");
    },
    onError: (error) => {
      toast.error("Failed to resolve alert: " + error.message);
    },
  });
}
