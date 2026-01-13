import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

export function useDrivers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return query;
}

export function useDriverLocations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["driver-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("driver_locations")
        .select(`
          *,
          driver:drivers(id, full_name, phone, vehicle_type, vehicle_number, is_online)
        `);

      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription for driver locations
  useEffect(() => {
    const channel = supabase
      .channel("driver-locations-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "driver_locations" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["driver-locations"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useVerifyDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ driverId, isVerified }: { driverId: string; isVerified: boolean }) => {
      const { error } = await supabase
        .from("drivers")
        .update({ is_verified: isVerified, is_active: isVerified })
        .eq("id", driverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver verification updated");
    },
    onError: (error) => {
      toast.error("Failed to update driver: " + error.message);
    },
  });
}

export function useSuspendDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (driverId: string) => {
      const { error } = await supabase
        .from("drivers")
        .update({ is_active: false, is_online: false })
        .eq("id", driverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver suspended");
    },
    onError: (error) => {
      toast.error("Failed to suspend driver: " + error.message);
    },
  });
}

export function useOnlineDrivers() {
  return useQuery({
    queryKey: ["drivers-online"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("id, full_name, phone, vehicle_number")
        .eq("is_verified", true)
        .eq("is_online", true);

      if (error) throw error;
      return data;
    },
  });
}

export function useDriversStats() {
  return useQuery({
    queryKey: ["drivers-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("id, is_verified, is_online, is_active");

      if (error) throw error;

      const total = data?.length || 0;
      const verified = data?.filter(d => d.is_verified).length || 0;
      const online = data?.filter(d => d.is_online).length || 0;
      const pending = data?.filter(d => !d.is_verified).length || 0;

      return { total, verified, online, offline: verified - online, pending };
    },
    refetchInterval: 30000,
  });
}
