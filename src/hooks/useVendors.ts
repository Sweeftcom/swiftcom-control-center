import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useVerifyVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, isVerified }: { vendorId: string; isVerified: boolean }) => {
      const { error } = await supabase
        .from("vendors")
        .update({ is_verified: isVerified })
        .eq("id", vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor verification updated");
    },
    onError: (error) => {
      toast.error("Failed to update vendor: " + error.message);
    },
  });
}

export function useSuspendVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendorId: string) => {
      const { error } = await supabase
        .from("vendors")
        .update({ is_active: false })
        .eq("id", vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor suspended");
    },
    onError: (error) => {
      toast.error("Failed to suspend vendor: " + error.message);
    },
  });
}

export function useUpdateVendorCommission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, commissionRate }: { vendorId: string; commissionRate: number }) => {
      const { error } = await supabase
        .from("vendors")
        .update({ commission_rate: commissionRate })
        .eq("id", vendorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Commission rate updated");
    },
    onError: (error) => {
      toast.error("Failed to update commission: " + error.message);
    },
  });
}

export function useVendorsStats() {
  return useQuery({
    queryKey: ["vendors-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, is_verified, is_active");

      if (error) throw error;

      const total = data?.length || 0;
      const verified = data?.filter(v => v.is_verified).length || 0;
      const active = data?.filter(v => v.is_active && v.is_verified).length || 0;
      const pending = data?.filter(v => !v.is_verified).length || 0;

      return { total, verified, active, inactive: verified - active, pending };
    },
    refetchInterval: 30000,
  });
}
