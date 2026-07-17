import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getSeoSettings, upsertSeoSetting } from '@/lib/api';
import type { SeoSetting } from '@/types/types';

const PAGE_KEYS = [
  { key: 'home', label: 'Home' },
  { key: 'products', label: 'Products' },
  { key: 'about', label: 'About Us' },
  { key: 'contact', label: 'Contact' },
];

export default function AdminSeoPage() {
  const { t } = useTranslation();
  const [seoMap, setSeoMap] = useState<Record<string, Partial<SeoSetting>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const load = () => {
    setLoading(true);
    getSeoSettings()
      .then(data => {
        const map: Record<string, Partial<SeoSetting>> = {};
        PAGE_KEYS.forEach(pk => {
          const found = data.find(d => d.page_key === pk.key);
          map[pk.key] = found || { page_key: pk.key, title: '', description: '', keywords: '', og_image: '' };
        });
        setSeoMap(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (pageKey: string) => {
    const seo = seoMap[pageKey];
    if (!seo) return;
    setSaving(pageKey);
    try {
      await upsertSeoSetting({ ...seo, page_key: pageKey } as SeoSetting);
      toast.success('SEO settings saved');
      load();
    } catch { toast.error('Save failed'); }
    finally { setSaving(null); }
  };

  const update = (pageKey: string, field: string, value: string) => {
    setSeoMap(prev => ({ ...prev, [pageKey]: { ...prev[pageKey], [field]: value } }));
  };

  if (loading) return <div className="p-4 text-muted-foreground">Loading...</div>;

  const current = seoMap[activeTab] || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t('admin.seo')}</h1>
        <p className="text-sm text-muted-foreground">Configure SEO metadata for each page</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {PAGE_KEYS.map(pk => <TabsTrigger key={pk.key} value={pk.key}>{pk.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">{PAGE_KEYS.find(p => p.key === activeTab)?.label} Page SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Page Title <span className="text-xs text-muted-foreground">(Recommended: 50–60 chars)</span></Label>
            <Input
              value={current.title || ''}
              onChange={e => update(activeTab, 'title', e.target.value)}
              placeholder="Page title for search engines"
            />
            <p className="text-xs text-muted-foreground">{(current.title || '').length} / 60 chars</p>
          </div>
          <div className="space-y-1.5">
            <Label>Meta Description <span className="text-xs text-muted-foreground">(Recommended: 150–160 chars)</span></Label>
            <Textarea
              value={current.description || ''}
              onChange={e => update(activeTab, 'description', e.target.value)}
              placeholder="Description shown in search results"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{(current.description || '').length} / 160 chars</p>
          </div>
          <div className="space-y-1.5">
            <Label>Keywords <span className="text-xs text-muted-foreground">(comma separated)</span></Label>
            <Input
              value={current.keywords || ''}
              onChange={e => update(activeTab, 'keywords', e.target.value)}
              placeholder="LiFePO4, energy storage, solar inverter"
            />
          </div>
          <div className="space-y-1.5">
            <Label>OG Image URL <span className="text-xs text-muted-foreground">(Social share image, 1200×630px recommended)</span></Label>
            <Input
              value={current.og_image || ''}
              onChange={e => update(activeTab, 'og_image', e.target.value)}
              placeholder="https://..."
            />
            {current.og_image && (
              <div className="mt-2 rounded overflow-hidden max-w-xs bg-muted">
                <img src={current.og_image} alt="OG preview" className="w-full object-cover" />
              </div>
            )}
          </div>

          {/* Preview */}
          {(current.title || current.description) && (
            <div className="border rounded-md p-4 space-y-1 bg-muted/50">
              <p className="text-xs text-muted-foreground font-medium">Search Preview:</p>
              <p className="text-sm text-blue-600 font-medium line-clamp-1">{current.title || 'Page Title'}</p>
              <p className="text-xs text-green-700">https://haosipower.com/{activeTab === 'home' ? '' : activeTab}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{current.description || 'Page description...'}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => handleSave(activeTab)} disabled={saving === activeTab}>
              <Save className="h-4 w-4 mr-1" />
              {saving === activeTab ? 'Saving...' : t('admin.save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}