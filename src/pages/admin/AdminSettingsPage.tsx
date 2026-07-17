import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getSiteSettings, updateSiteSetting } from '@/lib/api';
import type { SiteSetting } from '@/types/types';

const SETTINGS_SCHEMA = [
  { key: 'site_name', label: 'Site Name', placeholder: 'Haosi Power' },
  { key: 'site_url', label: 'Site URL', placeholder: 'https://haosipower.com' },
  { key: 'footer_text', label: 'Footer Text', placeholder: '© 2026 Haosi Power. All rights reserved.' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'info@haosipower.com' },
  { key: 'logo_url', label: 'Logo URL', placeholder: 'https://...' },
];

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(data => {
        setSettings(data);
        const vals: Record<string, string> = {};
        data.forEach(s => { vals[s.key] = s.value; });
        SETTINGS_SCHEMA.forEach(s => { if (!vals[s.key]) vals[s.key] = ''; });
        setFormValues(vals);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        SETTINGS_SCHEMA.map(s => updateSiteSetting(s.key, formValues[s.key] || ''))
      );
      toast.success('Settings saved successfully');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-4 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold">{t('admin.settings')}</h1>
        <p className="text-sm text-muted-foreground">Configure general website settings</p>
      </div>

      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">General Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {SETTINGS_SCHEMA.map(schema => (
            <div key={schema.key} className="space-y-1.5">
              <Label>{schema.label}</Label>
              <Input
                value={formValues[schema.key] || ''}
                onChange={e => setFormValues(prev => ({ ...prev, [schema.key]: e.target.value }))}
                placeholder={schema.placeholder}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
        <p className="text-sm font-medium">Admin Credentials</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Email: <span className="font-mono text-foreground">admin@miaoda.com</span></p>
          <p>Password: <span className="font-mono text-foreground">Haosi@Power2026!Adm</span></p>
        </div>
        <p className="text-xs text-muted-foreground">Keep these credentials secure.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? 'Saving...' : t('admin.save')}
        </Button>
      </div>
    </div>
  );
}