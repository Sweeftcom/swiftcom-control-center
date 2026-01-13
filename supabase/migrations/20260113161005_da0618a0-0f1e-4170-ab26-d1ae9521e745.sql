-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'vendor', 'driver', 'customer');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  store_name TEXT NOT NULL,
  category TEXT DEFAULT 'Food',
  phone TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  commission_rate DECIMAL(5, 2) DEFAULT 15.00,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  fssai_license TEXT,
  gst_certificate TEXT,
  pan_card TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  vehicle_type TEXT DEFAULT 'Bike',
  vehicle_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  driving_license TEXT,
  aadhar_card TEXT,
  rc_book TEXT,
  insurance TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  default_address TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create orders_sweeftcom table
CREATE TABLE public.orders_sweeftcom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash',
  payment_status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  delivery_latitude DECIMAL(10, 8),
  delivery_longitude DECIMAL(11, 8),
  pickup_photo_url TEXT,
  delivery_photo_url TEXT,
  distance_km DECIMAL(6, 2),
  driver_earnings DECIMAL(10, 2) DEFAULT 0,
  vendor_payout DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  accepted_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create driver_locations table (real-time tracking)
CREATE TABLE public.driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL UNIQUE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  heading DECIMAL(5, 2),
  speed DECIMAL(5, 2),
  accuracy DECIMAL(6, 2),
  last_updated TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create admin_alerts table for system health monitoring
CREATE TABLE public.admin_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'warning',
  title TEXT NOT NULL,
  message TEXT,
  order_id UUID REFERENCES public.orders_sweeftcom(id) ON DELETE CASCADE,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create driver_payouts table
CREATE TABLE public.driver_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_sweeftcom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_payouts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (admin only)
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for vendors
CREATE POLICY "Vendors can view own data" ON public.vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors can update own data" ON public.vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage vendors" ON public.vendors FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view active vendors" ON public.vendors FOR SELECT USING (is_verified = true AND is_active = true);

-- RLS Policies for drivers
CREATE POLICY "Drivers can view own data" ON public.drivers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Drivers can update own data" ON public.drivers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage drivers" ON public.drivers FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Vendors can view online drivers" ON public.drivers FOR SELECT USING (is_verified = true AND is_online = true);

-- RLS Policies for customers
CREATE POLICY "Customers can view own data" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can update own data" ON public.customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Vendors can view customer orders" ON public.customers FOR SELECT USING (public.has_role(auth.uid(), 'vendor'));

-- RLS Policies for orders
CREATE POLICY "Customers view own orders" ON public.orders_sweeftcom FOR SELECT USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));
CREATE POLICY "Vendors view their orders" ON public.orders_sweeftcom FOR SELECT USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Drivers view assigned orders" ON public.orders_sweeftcom FOR SELECT USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage all orders" ON public.orders_sweeftcom FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for driver_locations
CREATE POLICY "Drivers update own location" ON public.driver_locations FOR ALL USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));
CREATE POLICY "Admins view all locations" ON public.driver_locations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Vendors view driver locations" ON public.driver_locations FOR SELECT USING (public.has_role(auth.uid(), 'vendor'));

-- RLS Policies for admin_alerts (admin only)
CREATE POLICY "Admins manage alerts" ON public.admin_alerts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for audit_logs (admin only)
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for driver_payouts
CREATE POLICY "Drivers view own payouts" ON public.driver_payouts FOR SELECT USING (driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage payouts" ON public.driver_payouts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders_sweeftcom FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON public.orders_sweeftcom FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders_sweeftcom;
ALTER PUBLICATION supabase_realtime ADD TABLE public.driver_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_alerts;

-- Create admin dashboard statistics RPC
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_build_object(
    'total_orders_today', (SELECT COUNT(*) FROM orders_sweeftcom WHERE DATE(created_at) = CURRENT_DATE),
    'revenue_today', (SELECT COALESCE(SUM(total_amount), 0) FROM orders_sweeftcom WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'),
    'active_drivers', (SELECT COUNT(*) FROM drivers WHERE is_online = true),
    'total_drivers', (SELECT COUNT(*) FROM drivers WHERE is_verified = true),
    'active_vendors', (SELECT COUNT(*) FROM vendors WHERE is_active = true AND is_verified = true),
    'total_vendors', (SELECT COUNT(*) FROM vendors),
    'pending_orders', (SELECT COUNT(*) FROM orders_sweeftcom WHERE status = 'pending'),
    'total_customers', (SELECT COUNT(*) FROM customers),
    'avg_delivery_time_mins', 19,
    'cancellation_rate', (SELECT ROUND(COUNT(*) FILTER (WHERE status = 'cancelled')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) FROM orders_sweeftcom WHERE DATE(created_at) = CURRENT_DATE),
    'platform_fees_today', (SELECT COALESCE(SUM(platform_fee), 0) FROM orders_sweeftcom WHERE DATE(created_at) = CURRENT_DATE AND status = 'delivered'),
    'driver_payouts_pending', (SELECT COALESCE(SUM(amount), 0) FROM driver_payouts WHERE status = 'pending')
  ) INTO result;

  RETURN result;
END;
$$;

-- Create batch payout function
CREATE OR REPLACE FUNCTION public.batch_payout_drivers(driver_ids UUID[], payout_notes TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  driver_id UUID;
  total_processed INTEGER := 0;
  total_amount DECIMAL := 0;
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  FOREACH driver_id IN ARRAY driver_ids LOOP
    -- Calculate pending earnings
    INSERT INTO driver_payouts (driver_id, amount, status, payout_date, notes, processed_by)
    SELECT 
      driver_id,
      COALESCE(SUM(driver_earnings), 0),
      'processed',
      NOW(),
      payout_notes,
      auth.uid()
    FROM orders_sweeftcom
    WHERE orders_sweeftcom.driver_id = batch_payout_drivers.driver_id
      AND status = 'delivered'
      AND delivered_at > (SELECT COALESCE(MAX(payout_date), '1970-01-01') FROM driver_payouts WHERE driver_payouts.driver_id = batch_payout_drivers.driver_id);
    
    total_processed := total_processed + 1;
  END LOOP;

  RETURN json_build_object('processed', total_processed, 'total_amount', total_amount);
END;
$$;

-- Create suspend user function
CREATE OR REPLACE FUNCTION public.suspend_user(target_user_id UUID, entity_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF entity_type = 'driver' THEN
    UPDATE drivers SET is_active = false, is_online = false WHERE user_id = target_user_id;
  ELSIF entity_type = 'vendor' THEN
    UPDATE vendors SET is_active = false WHERE user_id = target_user_id;
  END IF;

  -- Log the action
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_values)
  VALUES (auth.uid(), 'suspend', entity_type, target_user_id, json_build_object('suspended', true));

  RETURN TRUE;
END;
$$;