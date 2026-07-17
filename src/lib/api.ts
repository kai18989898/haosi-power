import { supabase } from '@/db/supabase';
import type {
  Product,
  Banner,
  SiteContent,
  SeoSetting,
  SocialLink,
  ContactInfo,
  ContactMessage,
  SiteSetting,
  ProductCategory,
} from '@/types/types';

// ===== Products =====
export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  let query = supabase.from('products').select('*').eq('is_active', true).order('sort_order', { ascending: true });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function upsertProduct(product: Partial<Product> & { category: ProductCategory; name: string }) {
  if (product.id) {
    const { error } = await supabase.from('products').update({ ...product, updated_at: new Date().toISOString() }).eq('id', product.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('products').insert(product);
    if (error) throw error;
  }
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ===== Banners =====
export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAllBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function upsertBanner(banner: Partial<Banner> & { image_url: string }) {
  if (banner.id) {
    const { error } = await supabase.from('banners').update(banner).eq('id', banner.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('banners').insert(banner);
    if (error) throw error;
  }
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw error;
}

// ===== Site Content =====
export async function getSiteContent(): Promise<SiteContent[]> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function upsertSiteContent(content: Partial<SiteContent> & { section_key: string; title: string }) {
  if (content.id) {
    const { error } = await supabase.from('site_content').update({ ...content, updated_at: new Date().toISOString() }).eq('id', content.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('site_content').insert(content);
    if (error) throw error;
  }
}

export async function deleteSiteContent(id: string) {
  const { error } = await supabase.from('site_content').delete().eq('id', id);
  if (error) throw error;
}

// ===== SEO Settings =====
export async function getSeoSettings(): Promise<SeoSetting[]> {
  const { data, error } = await supabase.from('seo_settings').select('*').order('page_key', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getSeoSetting(pageKey: string): Promise<SeoSetting | null> {
  const { data, error } = await supabase.from('seo_settings').select('*').eq('page_key', pageKey).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSeoSetting(seo: Partial<SeoSetting> & { page_key: string }) {
  if (seo.id) {
    const { error } = await supabase.from('seo_settings').update({ ...seo, updated_at: new Date().toISOString() }).eq('id', seo.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('seo_settings').insert(seo);
    if (error) throw error;
  }
}

// ===== Social Links =====
export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAllSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function upsertSocialLink(link: Partial<SocialLink> & { platform: string }) {
  if (link.id) {
    const { error } = await supabase.from('social_links').update(link).eq('id', link.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('social_links').insert(link);
    if (error) throw error;
  }
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) throw error;
}

// ===== Contact Info =====
export async function getContactInfo(): Promise<ContactInfo | null> {
  const { data, error } = await supabase.from('contact_info').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateContactInfo(info: Partial<ContactInfo> & { id: string }) {
  const { error } = await supabase.from('contact_info').update({ ...info, updated_at: new Date().toISOString() }).eq('id', info.id);
  if (error) throw error;
}

// ===== Contact Messages =====
export async function submitContactMessage(msg: { name: string; email: string; phone: string; message: string }) {
  const { error } = await supabase.from('contact_messages').insert(msg);
  if (error) throw error;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

// ===== Site Settings =====
export async function getSiteSettings(): Promise<SiteSetting[]> {
  const { data, error } = await supabase.from('site_settings').select('*').order('key', { ascending: true });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function updateSiteSetting(key: string, value: string) {
  const { error } = await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
  if (error) throw error;
}

// ===== Search =====
export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,specs.ilike.%${query}%`)
    .order('sort_order', { ascending: true })
    .limit(20);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// ===== Image Upload =====
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('website-images')
    .upload(fileName, file, { contentType: file.type });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('website-images').getPublicUrl(data.path);
  return urlData.publicUrl;
}