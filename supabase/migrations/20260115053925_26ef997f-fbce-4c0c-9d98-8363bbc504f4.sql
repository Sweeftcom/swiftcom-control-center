-- Fix 1: Restrict vendors to only see locations of drivers assigned to their active orders
DROP POLICY IF EXISTS "Vendors view driver locations" ON public.driver_locations;

CREATE POLICY "Vendors view assigned driver locations" 
ON public.driver_locations FOR SELECT 
USING (
  driver_id IN (
    SELECT o.driver_id 
    FROM orders_sweeftcom o
    WHERE o.vendor_id IN (
      SELECT id FROM vendors WHERE user_id = auth.uid()
    )
    AND o.status IN ('accepted', 'preparing', 'ready', 'picked_up')
    AND o.driver_id IS NOT NULL
  )
);

-- Fix 2: Add INSERT policy for customers to create orders
CREATE POLICY "Customers create own orders" 
ON public.orders_sweeftcom FOR INSERT 
WITH CHECK (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
  AND status = 'pending'
);

-- Fix 3: Add UPDATE policy for customers to cancel their pending/accepted orders
CREATE POLICY "Customers cancel own orders" 
ON public.orders_sweeftcom FOR UPDATE 
USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
WITH CHECK (
  status = 'cancelled' 
  AND cancellation_reason IS NOT NULL
);

-- Fix 4: Add UPDATE policy for vendors to update order prep status
CREATE POLICY "Vendors update order status" 
ON public.orders_sweeftcom FOR UPDATE 
USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()))
WITH CHECK (
  status IN ('accepted', 'preparing', 'ready', 'cancelled')
);

-- Fix 5: Add UPDATE policy for drivers to update delivery progress
CREATE POLICY "Drivers update assigned orders" 
ON public.orders_sweeftcom FOR UPDATE 
USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()))
WITH CHECK (
  status IN ('picked_up', 'delivered')
);