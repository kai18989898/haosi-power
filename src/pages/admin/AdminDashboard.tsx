import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, MessageSquare, Image, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getAllProducts, getAllBanners, getContactMessages } from '@/lib/api';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, banners: 0, messages: 0, content: 0 });

  useEffect(() => {
    Promise.all([getAllProducts(), getAllBanners(), getContactMessages()])
      .then(([products, banners, messages]) => {
        setStats({ products: products.length, banners: banners.length, messages: messages.length, content: 0 });
      })
      .catch(console.error);
  }, []);

  const cards = [
    { label: t('admin.products'), value: stats.products, icon: Package, path: '/admin/products', color: 'bg-blue-500/10 text-blue-600' },
    { label: t('admin.banners'), value: stats.banners, icon: Image, path: '/admin/banners', color: 'bg-green-500/10 text-green-600' },
    { label: t('admin.messages'), value: stats.messages, icon: MessageSquare, path: '/admin/messages', color: 'bg-orange-500/10 text-orange-600' },
    { label: t('admin.content'), value: '-', icon: FileText, path: '/admin/content', color: 'bg-purple-500/10 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t('admin.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Manage your website content here.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="cursor-pointer hover:shadow-hover transition-shadow" onClick={() => navigate(card.path)}>
              <CardContent className="p-5 space-y-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}