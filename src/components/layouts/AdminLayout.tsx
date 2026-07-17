import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Image,
  Package,
  FileText,
  Search,
  Share2,
  Phone,
  MessageSquare,
  Settings,
  Menu,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { key: 'banners', label: 'admin.banners', path: '/admin/banners', icon: Image },
  { key: 'products', label: 'admin.products', path: '/admin/products', icon: Package },
  { key: 'content', label: 'admin.content', path: '/admin/content', icon: FileText },
  { key: 'seo', label: 'admin.seo', path: '/admin/seo', icon: Search },
  { key: 'social', label: 'admin.social', path: '/admin/social', icon: Share2 },
  { key: 'contact_info', label: 'admin.contact_info', path: '/admin/contact-info', icon: Phone },
  { key: 'messages', label: 'admin.messages', path: '/admin/messages', icon: MessageSquare },
  { key: 'settings', label: 'admin.settings', path: '/admin/settings', icon: Settings },
];

function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.key}
            to={item.path}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r bg-card">
        <div className="flex items-center gap-2 h-16 px-4 border-b">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span className="font-bold">{t('admin.title')}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavContent />
        </div>
        <div className="p-3 border-t space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('admin.back_to_site')}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile header + content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center h-14 px-4 border-b md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <div className="flex items-center gap-2 h-14 px-4 border-b">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span className="font-bold text-sm">{t('admin.title')}</span>
              </div>
              <NavContent onItemClick={() => setMobileOpen(false)} />
              <div className="p-3 border-t space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('admin.back_to_site')}
                </Link>
                <button
                  type="button"
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors w-full"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-bold text-sm ml-2">{t('admin.title')}</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}