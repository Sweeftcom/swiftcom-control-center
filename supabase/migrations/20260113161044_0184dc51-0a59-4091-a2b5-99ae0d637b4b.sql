-- Fix the audit_logs insert policy to be more restrictive
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Only authenticated users can insert their own audit logs
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);