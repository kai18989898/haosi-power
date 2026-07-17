import type { ReactNode } from 'react';
import FrontLayout from './components/layouts/FrontLayout';
import AdminLayout from './components/layouts/AdminLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminSeoPage from './pages/admin/AdminSeoPage';
import AdminSocialPage from './pages/admin/AdminSocialPage';
import AdminContactInfoPage from './pages/admin/AdminContactInfoPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
  layout?: 'front' | 'admin';
}

export const routes: RouteConfig[] = [
  // Front public routes
  {
    name: 'Home',
    path: '/',
    element: <FrontLayout />,
    public: true,
    layout: 'front',
  },
  {
    name: 'Products',
    path: '/products',
    element: <FrontLayout />,
    public: true,
    layout: 'front',
  },
  {
    name: 'About',
    path: '/about',
    element: <FrontLayout />,
    public: true,
    layout: 'front',
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <FrontLayout />,
    public: true,
    layout: 'front',
  },
  {
    name: 'Search',
    path: '/search',
    element: <FrontLayout />,
    public: true,
    layout: 'front',
  },
  // Admin public login
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLoginPage />,
    public: true,
  },
  // Admin routes (protected)
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin Banners',
    path: '/admin/banners',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin Products',
    path: '/admin/products',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin Content',
    path: '/admin/content',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin SEO',
    path: '/admin/seo',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin Social',
    path: '/admin/social',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin Contact Info',
    path: '/admin/contact-info',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin Messages',
    path: '/admin/messages',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
  {
    name: 'Admin Settings',
    path: '/admin/settings',
    element: <AdminLayout />,
    public: false,
    layout: 'admin',
  },
];

// Sub-routes mapping
export const subRoutes: Record<string, ReactNode[]> = {
  '/': [<HomePage key="home" />],
  '/products': [<ProductsPage key="products" />],
  '/about': [<AboutPage key="about" />],
  '/contact': [<ContactPage key="contact" />],
  '/search': [<SearchPage key="search" />],
  '/admin': [<AdminDashboard key="dashboard" />],
  '/admin/banners': [<AdminBannersPage key="banners" />],
  '/admin/products': [<AdminProductsPage key="products" />],
  '/admin/content': [<AdminContentPage key="content" />],
  '/admin/seo': [<AdminSeoPage key="seo" />],
  '/admin/social': [<AdminSocialPage key="social" />],
  '/admin/contact-info': [<AdminContactInfoPage key="contact-info" />],
  '/admin/messages': [<AdminMessagesPage key="messages" />],
  '/admin/settings': [<AdminSettingsPage key="settings" />],
};