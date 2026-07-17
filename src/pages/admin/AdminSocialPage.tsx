import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getAllSocialLinks, upsertSocialLink, deleteSocialLink } from '@/lib/api';
import type { SocialLink } from '@/types/types';

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'tiktok', label: 'TikTok', icon: MessageCircle },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
];

export default function AdminSocialPage() {
  const { t } = useTranslation();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<SocialLink> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); getAllSocialLinks().then(setLinks).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => { setEditing({ platform: 'facebook', icon: 'facebook', url: '', is_active: true, sort_order: links.length + 1 }); setDialogOpen(true); };
  const openEdit = (l: SocialLink) => { setEditing({ ...l }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!editing?.platform || !editing?.url) { toast.error('Platform and URL are required'); return; }
    setSaving(true);
    try {
      await upsertSocialLink(editing as SocialLink);
      toast.success('Saved');
      setDialogOpen(false); load();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteSocialLink(id); toast.success('Deleted'); load(); } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (link: SocialLink) => {
    try { await upsertSocialLink({ ...link, is_active: !link.is_active }); load(); } catch { toast.error('Update failed'); }
  };

  const getPlatformIcon = (icon: string) => {
    const p = PLATFORMS.find(p => p.value === icon);
    if (!p) return <MessageCircle className="h-5 w-5" />;
    const Icon = p.icon;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{t('admin.social')}</h1>
          <p className="text-sm text-muted-foreground">Manage social media links</p>
        </div>
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" />{t('admin.add')}</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i}><CardContent className="p-4"><div className="h-4 w-1/2 bg-muted rounded animate-pulse" /></CardContent></Card>)}</div>
      ) : (
        <div className="space-y-3">
          {links.map(link => (
            <Card key={link.id} className={`${!link.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground shrink-0">
                  {getPlatformIcon(link.icon)}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-medium text-sm capitalize">{link.platform}</p>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors truncate block">{link.url}</a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={link.is_active} onCheckedChange={() => handleToggle(link)} />
                  <Button variant="outline" size="sm" onClick={() => openEdit(link)}><Pencil className="h-3 w-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30"><Trash2 className="h-3 w-3" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                      <AlertDialogHeader><AlertDialogTitle>Delete link?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(link.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md">
          <DialogHeader><DialogTitle>{editing?.id ? t('admin.edit') : t('admin.add')} Social Link</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Platform *</Label>
              <Select value={editing?.platform || 'facebook'} onValueChange={v => setEditing(prev => prev ? { ...prev, platform: v, icon: v } : null)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>URL *</Label>
              <Input value={editing?.url || ''} onChange={e => setEditing(prev => prev ? { ...prev, url: e.target.value } : null)} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={editing?.is_active ?? true} onCheckedChange={v => setEditing(prev => prev ? { ...prev, is_active: v } : null)} />
              <Label>{editing?.is_active ? t('admin.active') : t('admin.inactive')}</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('admin.cancel')}</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}