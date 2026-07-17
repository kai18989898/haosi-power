import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getAllBanners, upsertBanner, deleteBanner, uploadImage } from '@/lib/api';
import type { Banner } from '@/types/types';

export default function AdminBannersPage() {
  const { t } = useTranslation();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllBanners().then(setBanners).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing({ image_url: '', title: '', subtitle: '', sort_order: banners.length + 1, is_active: true }); setDialogOpen(true); };
  const openEdit = (b: Banner) => { setEditing({ ...b }); setDialogOpen(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditing(prev => prev ? { ...prev, image_url: url } : null);
    } catch { toast.error('Image upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!editing?.image_url) { toast.error('Image URL is required'); return; }
    setSaving(true);
    try {
      await upsertBanner(editing as Banner);
      toast.success('Saved successfully');
      setDialogOpen(false);
      load();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteBanner(id); toast.success('Deleted'); load(); } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (banner: Banner) => {
    try { await upsertBanner({ ...banner, is_active: !banner.is_active }); load(); } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{t('admin.banners')}</h1>
          <p className="text-sm text-muted-foreground">{banners.length} banners</p>
        </div>
        <Button onClick={openAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" />{t('admin.add')}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <Card key={i}><div className="aspect-video bg-muted animate-pulse rounded-t-lg" /><CardContent className="p-4"><div className="h-4 w-3/4 bg-muted rounded animate-pulse" /></CardContent></Card>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(banner => (
            <Card key={banner.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {banner.image_url && <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />}
                <div className="absolute top-2 right-2">
                  <Switch checked={banner.is_active} onCheckedChange={() => handleToggle(banner)} />
                </div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-medium text-sm line-clamp-1">{banner.title || '(No title)'}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{banner.subtitle}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => openEdit(banner)}>
                    <Pencil className="h-3 w-3 mr-1" />{t('admin.edit')}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3 mr-1" />{t('admin.delete')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                      <AlertDialogHeader><AlertDialogTitle>Delete Banner?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(banner.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? t('admin.edit') : t('admin.add')} Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Image *</Label>
              <div className="space-y-2">
                {editing?.image_url && <div className="aspect-video rounded overflow-hidden bg-muted"><img src={editing.image_url} alt="" className="w-full h-full object-cover" /></div>}
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Or paste URL:</Label>
                  <Input value={editing?.image_url || ''} onChange={e => setEditing(prev => prev ? { ...prev, image_url: e.target.value } : null)} placeholder="https://..." />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={editing?.title || ''} onChange={e => setEditing(prev => prev ? { ...prev, title: e.target.value } : null)} />
            </div>
            <div className="space-y-1.5">
              <Label>Subtitle</Label>
              <Input value={editing?.subtitle || ''} onChange={e => setEditing(prev => prev ? { ...prev, subtitle: e.target.value } : null)} />
            </div>
            <div className="flex items-center gap-3">
              <Label>Sort Order</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setEditing(prev => prev ? { ...prev, sort_order: Math.max(1, (prev.sort_order || 1) - 1) } : null)}><ArrowUp className="h-3 w-3" /></Button>
                <span className="text-sm w-6 text-center">{editing?.sort_order || 1}</span>
                <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => setEditing(prev => prev ? { ...prev, sort_order: (prev.sort_order || 1) + 1 } : null)}><ArrowDown className="h-3 w-3" /></Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={editing?.is_active ?? true} onCheckedChange={v => setEditing(prev => prev ? { ...prev, is_active: v } : null)} />
              <Label>{editing?.is_active ? t('admin.active') : t('admin.inactive')}</Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('admin.cancel')}</Button>
              <Button onClick={handleSave} disabled={saving || uploading}>{saving ? 'Saving...' : t('admin.save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}