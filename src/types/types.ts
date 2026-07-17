export type UserRole = 'user' | 'admin';
export type ProductCategory = 'power_supply' | 'inverter' | 'solar_panel';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  description: string;
  specs: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SiteContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

export interface SeoSetting {
  id: string;
  page_key: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface ContactInfo {
  id: string;
  whatsapp_numbers: string[];
  email: string;
  address: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}