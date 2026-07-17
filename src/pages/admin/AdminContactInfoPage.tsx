import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getContactInfo, updateContactInfo } from '@/lib/api';
import type { ContactInfo } from '@/types/types';

export default function AdminContactInfoPage() {
  const { t } = useTranslation();
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getContactInfo()
      .then(d => setInfo(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!info?.id) return;
    setSaving(true);
    try {
      await updateContactInfo(info);
      toast.success('Contact info saved');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const updatePhone = (idx: number, val: string) => {
    if (!info) return;
    const nums = [...(info.whatsapp_numbers || [])];
    nums[idx] = val;
    setInfo({ ...info, whatsapp_numbers: nums });
  };

  const addPhone = () => {
    if (!info) return;
    setInfo({ ...info, whatsapp_numbers: [...(info.whatsapp_numbers || []), ''] });
  };

  const removePhone = (idx: number) => {
    if (!info) return;
    const nums = [...(info.whatsapp_numbers || [])];
    nums.splice(idx, 1);
    setInfo({ ...info, whatsapp_numbers: nums });
  };

  if (loading) return <div className="p-4 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold">{t('admin.contact_info')}</h1>
        <p className="text-sm text-muted-foreground">Manage contact details shown on the website</p>
      </div>

      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">WhatsApp Numbers</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(info?.whatsapp_numbers || []).map((num, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                value={num}
                onChange={e => updatePhone(idx, e.target.value)}
                placeholder="+86 13530267096"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removePhone(idx)}
                className="text-destructive border-destructive/30 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addPhone}>
            <Plus className="h-4 w-4 mr-1" />Add Number
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4"><CardTitle className="text-base">Other Contact Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={info?.email || ''}
              onChange={e => setInfo(prev => prev ? { ...prev, email: e.target.value } : null)}
              placeholder="info@haosipower.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              value={info?.address || ''}
              onChange={e => setInfo(prev => prev ? { ...prev, address: e.target.value } : null)}
              placeholder="Company address"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !info?.id}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? 'Saving...' : t('admin.save')}
        </Button>
      </div>
    </div>
  );
}