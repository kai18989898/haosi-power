-- 用户角色枚举
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- 用户档案表
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 自动同步新用户到profiles
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (NEW.id, NEW.email, NEW.phone, 'user'::public.user_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 角色查询辅助函数
CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = uid;
$$;

-- Profiles RLS
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM public.get_user_role(auth.uid()));

CREATE VIEW public.public_profiles AS
  SELECT id, role FROM public.profiles;

-- 产品分类枚举
CREATE TYPE public.product_category AS ENUM ('power_supply', 'inverter', 'solar_panel');

-- 产品表
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category public.product_category NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  specs text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Banner表
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 网站内容表
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- SEO设置表
CREATE TABLE public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  keywords text NOT NULL DEFAULT '',
  og_image text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- 社交媒体链接表
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL UNIQUE,
  url text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 联系信息表
CREATE TABLE public.contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_numbers text[] NOT NULL DEFAULT '{}',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- 联系表单提交表
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 网站设置表
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ============ RLS 策略 ============

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage banners" ON public.banners
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Anyone can view site content" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Anyone can view seo settings" ON public.seo_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage seo settings" ON public.seo_settings
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Anyone can view social links" ON public.social_links
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage social links" ON public.social_links
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Anyone can view contact info" ON public.contact_info
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage contact info" ON public.contact_info
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view contact messages" ON public.contact_messages
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage contact messages" ON public.contact_messages
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role)
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- ============ Storage Bucket ============
INSERT INTO storage.buckets (id, name, public) VALUES ('website-images', 'website-images', true);

CREATE POLICY "Anyone can view website images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'website-images');
CREATE POLICY "Admins can upload website images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'website-images' AND public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can update website images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'website-images' AND public.get_user_role(auth.uid()) = 'admin'::public.user_role);
CREATE POLICY "Admins can delete website images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'website-images' AND public.get_user_role(auth.uid()) = 'admin'::public.user_role);

-- ============ 初始数据 ============

INSERT INTO public.banners (image_url, title, subtitle, sort_order) VALUES
('https://cdn.staticsyy.com/pics/4f2d3b9aa4af04716d804ddc980fe26abba2eb5d9632df3dac3b278dc09f6e4e.png', '51.2V 200Ah', 'Home Energy Storage Built for a Smarter Future', 1),
('https://cdn.staticsyy.com/pics/97082439650cf456638c7dd36b1f61125a1ed76c3d84508390c3c9622aecc21a.png', 'Energy Storage Solutions', 'Professional LiFePO4 Battery Systems for OEM/ODM', 2),
('https://cdn.staticsyy.com/pics/f2853f7ff0d4a7491d071997b5425b1d2a03674745c3294102b2151195383e99.png', '51.2V 400Ah', 'WIFI Bluetooth Optional BYD Blade Battery Cell', 3);

INSERT INTO public.products (category, name, description, specs, image_url, sort_order) VALUES
('power_supply', 'LiFePO4 Home Energy Storage Battery 5kWh-40kWh', 'Haosi 51.2V 100Ah/200Ah/300Ah/314Ah/400Ah/600Ah/800Ah LiFePO4 Home Energy Storage Battery. Home Energy Storage System with Lithium Battery for Solar OEM/ODM.', 'Voltage: 51.2V | Capacity: 100Ah-800Ah | Energy: 5kWh-40kWh | Cell: LiFePO4 | BMS: Smart BMS', 'https://cdn.staticsyy.com/pics/d8890fc7a2edb2000de2d036febcfbb265020beecf51101e7ff1f9efc4cfb121.png', 1),
('power_supply', 'LiFePO4 Home Energy Storage Battery 20kWh-40kWh', 'Haosi 51.2V 400Ah/600Ah/800Ah LiFePO4 Home Energy Storage Battery. Home Energy Storage System with Lithium Battery for Solar OEM/ODM.', 'Voltage: 51.2V | Capacity: 400Ah-800Ah | Energy: 20kWh-40kWh | Cell: LiFePO4 | BMS: Smart BMS', 'https://cdn.staticsyy.com/pics/7fbe3118e331408ca7003048f38ac19332778b271040a5ed7fd2829547a6bd1d.png', 2),
('power_supply', 'HSB1280Wh 1200W Balcony Energy Storage', 'Haosi HSB1280Wh1200W Home Energy Storage System: 1280Wh 1200W LiFePO4 Lithium Energy Storage Battery for Balcony.', 'Capacity: 1280Wh | Power: 1200W | Cell: LiFePO4 | Application: Balcony', 'https://cdn.staticsyy.com/uploads/138389/cart/resources/20251217/b605a162fcfa81374efcb1425adec075.jpg', 3),
('power_supply', 'HSB3264Wh 3000W Balcony Energy Storage', 'Haosi HSB3264Wh3000W Home Energy Storage System: 3.2kWh LiFePO4 Lithium Energy Storage Battery for Balcony, 3000W Solar Backup Power OEM/ODM.', 'Capacity: 3264Wh | Power: 3000W | Cell: LiFePO4 | Application: Balcony', 'https://cdn.staticsyy.com/uploads/138389/cart/resources/20251217/14560ca0fc61c0901f4164eadddcf7f4.jpg', 4),
('inverter', 'GD-Series L Hybrid Solar Inverter 8.6kW/11kW', 'Haosi GD-Series L Hybrid Solar Inverter with Dual MPPT 48V Solar Inverter. High efficiency and reliable performance.', 'Power: 8.6kW/11kW | MPPT: Dual | Voltage: 48V | Type: Hybrid', 'https://cdn.staticsyy.com/pics/52a9b2a51937c5b0eda79282eef442dc5c653459f8f99ffebd481d0f458456f4.png', 1),
('inverter', 'GD-Series Hybrid Solar Inverter 4kW-6.2kW', 'Haosi GD-Series Hybrid Solar Inverter with Dual Output MPPT Inverter. Suitable for residential and commercial applications.', 'Power: 4kW-6.2kW | MPPT: Dual Output | Type: Hybrid', 'https://cdn.staticsyy.com/pics/49ef5714856dad2a0283f8969025106dd54f21c678251d13b3a1dff9cc659166.jpg', 2),
('solar_panel', 'Vertex S+ NEG9RC.27 N-Type TOPCon 425W-450W', 'Haosi Solar Vertex S+ NEG9RC.27 N-Type TOPCon Bifacial Solar Panel. High efficiency bifacial design.', 'Power: 425W-450W | Type: N-Type TOPCon | Design: Bifacial', 'https://cdn.staticsyy.com/pics/0178cd415dfb2e56922478da34320d932ddd1c7003ddea61aeadbc0b21073d6a.png', 1),
('solar_panel', 'NEG18R.28 495W-525W N-Type TOPCon', 'Haosi Solar NEG18R.28 N-Type TOPCon Solar Panel for Commercial Rooftop applications.', 'Power: 495W-525W | Type: N-Type TOPCon | Application: Commercial Rooftop', 'https://cdn.staticsyy.com/pics/877b42d4531401810425eacc09cf3b9d2df4ae1e1fa35d31b6da7423be5bf9e4.png', 2),
('solar_panel', 'Vertex N TSM-NE19R 600W-630W', 'Haosi Solar Vertex N TSM-NE19R N-Type TOPCon Solar Panel 600W-630W High Efficiency Monocrystalline PV Module.', 'Power: 600W-630W | Type: N-Type TOPCon | Cell: Monocrystalline', 'https://cdn.staticsyy.com/pics/9202beef062a4a31652e101f63047f94e97a8435372481afc83b284058aea5be.png', 3),
('solar_panel', 'Vertex N TSM-NEG19RC.20 635W-650W', 'Haosi Solar Vertex N TSM-NEG19RC.20 635W-650W N-Type TOPCon Bifacial Solar Panel Dual Glass Module.', 'Power: 635W-650W | Type: N-Type TOPCon | Design: Bifacial Dual Glass', 'https://cdn.staticsyy.com/pics/18c861c8133b038e9fc4023533e2b10e73f8a8288764f0a4b7556874ef61b838.png', 4);

INSERT INTO public.site_content (section_key, title, content, sort_order) VALUES
('about_intro', 'About Haosi Power', 'Haosi Power is a leading manufacturer of LiFePO4 battery energy storage systems, hybrid solar inverters, and high-efficiency solar panels. With years of experience in the renewable energy industry, we provide comprehensive energy solutions for residential, commercial, and industrial applications worldwide.', 1),
('about_mission', 'Our Mission', 'To accelerate the worlds transition to sustainable energy by providing reliable, efficient, and affordable energy storage and solar solutions. We are committed to innovation, quality, and customer satisfaction in everything we do.', 2),
('about_history', 'Our History', 'Founded with a vision to make clean energy accessible to everyone, Haosi Power has grown from a small battery manufacturer to a comprehensive energy solutions provider. Today, we serve customers across multiple continents with our cutting-edge products.', 3),
('advantage_quality', 'Premium Quality', 'All products undergo rigorous testing and certification. We use only the highest-grade LiFePO4 cells and components to ensure maximum safety and longevity.', 1),
('advantage_innovation', 'Continuous Innovation', 'Our dedicated R&D team constantly pushes the boundaries of energy storage technology, bringing you the latest advancements in battery management and solar efficiency.', 2),
('advantage_global', 'Global Reach', 'With a robust supply chain and distribution network, we deliver our products to customers worldwide, providing reliable energy solutions wherever you are.', 3),
('advantage_service', 'Exceptional Service', 'From initial consultation to after-sales support, our team is committed to providing you with the best possible experience throughout your entire journey with us.', 4);

INSERT INTO public.seo_settings (page_key, title, description, keywords) VALUES
('home', 'Haosi Power - Leading LiFePO4 Battery Energy Storage System Manufacturer', 'Haosi Power is a leading manufacturer of LiFePO4 battery energy storage systems, hybrid solar inverters, and solar panels. OEM/ODM solutions for global B2B partners.', 'LiFePO4 battery, energy storage system, solar inverter, solar panel, OEM, ODM, B2B'),
('products', 'Products - Haosi Power Energy Storage Solutions', 'Explore our range of LiFePO4 energy storage batteries, hybrid solar inverters, and high-efficiency solar panels for residential and commercial applications.', 'energy storage battery, solar inverter, solar panel, LiFePO4, hybrid inverter'),
('about', 'About Us - Haosi Power', 'Learn about Haosi Power, a leading manufacturer of renewable energy solutions including energy storage systems, inverters, and solar panels.', 'about haosi power, energy storage manufacturer, renewable energy company'),
('contact', 'Contact Us - Haosi Power', 'Get in touch with Haosi Power for inquiries about our energy storage systems, solar inverters, and solar panels. WhatsApp support available.', 'contact haosi power, energy storage inquiry, solar panel supplier');

INSERT INTO public.social_links (platform, url, icon, sort_order) VALUES
('facebook', 'https://www.facebook.com/profile.php?id=61578581040727', 'facebook', 1),
('instagram', 'https://www.instagram.com/hs_new_energy', 'instagram', 2),
('tiktok', 'https://www.tiktok.com/@hs_new_energy', 'tiktok', 3),
('youtube', 'https://www.youtube.com', 'youtube', 4);

INSERT INTO public.contact_info (whatsapp_numbers, email, address) VALUES
(ARRAY['+8613530267096', '+8613178480646', '+8618102976015'], 'info@haosipower.com', 'Shenzhen, Guangdong, China');

INSERT INTO public.site_settings (key, value) VALUES
('site_name', 'Haosi Power'),
('site_domain', 'https://haosipower.com'),
('site_logo', ''),
('footer_text', '© 2026 Haosi Power. All rights reserved. Leading LiFePO4 Battery Energy Storage System Manufacturer.');