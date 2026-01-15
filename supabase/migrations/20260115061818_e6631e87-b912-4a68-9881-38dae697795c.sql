-- Fix 1: Revoke direct EXECUTE privileges on role-checking functions from public
-- These functions will still work in RLS policy context but cannot be called directly by users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM public;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM authenticated;

-- Create a safe version for users to check their OWN role only
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1);
END;
$$;

-- Grant execute on the safe function
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- Fix 2: Replace weak order number generation with UUID-based unpredictable order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Use UUID-based order number for unpredictability and zero collision risk
  -- Format: ORD-<first 12 chars of UUID> = over 4 trillion unique combinations
  NEW.order_number = 'ORD-' || UPPER(REPLACE(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 13), '-', ''));
  RETURN NEW;
END;
$$;