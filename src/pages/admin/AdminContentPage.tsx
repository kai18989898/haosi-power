import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getAllSiteContent, upsertSiteContent, deleteSiteContent, uploadImage } from '@/lib/api';
import type { SiteContent } from '@/types/types';

export default function AdminContentPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<SiteContent> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); getAllSiteContent().then(setItems).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openAdd = () => { setEditing({ section_key: '', title: '', content: '', image_url: '', sort_order: items.length + 1, is_active: true }); setDialogOpen(true); };
  const openEdit = (item: SiteContent) => { setEditing({ ...item }); setDialogOpen(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setEditing(prev => prev ? { ...prev, image_url: url } : null); }
    catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!editing?.section_key || !editing?.title) { toast.error('Section key and title are required'); return; }
    setSaving(true);
    try {
      await upsertSiteContent(editing as SiteContent);
      toast.success('Saved successfully');
      setDialogOpen(false); load();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteSiteContent(id); toast.success('Deleted'); load(); } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{t('admin.content')}</h1>
          <p className="text-sm text-muted-foreground">{items.length} sections</p>
        </div>
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" />{t('admin.add')}</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i}><CardContent className="p-4"><div className="h-4 w-1/2 bg-muted rounded animate-pulse" /></CardContent></Card>)}</div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id} className={`${!item.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4 flex items-start gap-4">
                {item.image_url && <div className="w-16 h-16 rounded overflow-hidden bg-muted shrink-0"><img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /></div>}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.section_key}</span>
                    {!item.is_active && <span className="text-xs text-muted-foreground">(hidden)</span>}
                  </div>
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30"><Trash2 className="h-3 w-3" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                      <AlertDialogHeader><AlertDialogTitle>Delete content?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg max-h-[90dvh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? t('admin.edit') : t('admin.add')} Content</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Section Key * <span className="text-xs text-muted-foreground">(e.g. advantage_1, about_intro)</span></Label>
              <Input value={editing?.section_key || ''} onChange={e => setEditing(prev => prev ? { ...prev, section_key: e.target.value } : null)} placeholder="advantage_1" />
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={editing?.title || ''} onChange={e => setEditing(prev => prev ? { ...prev, title: e.target.value } : null)} />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea value={editing?.content || ''} onChange={e => setEditing(prev => prev ? { ...prev, content: e.target.value } : null)} rows={4} />
            </div>
            <div className="space-y-1.5">
              <Label>Image</Label>
              {editing?.image_url && <div className="aspect-video rounded overflow-hidden bg-muted"><img src={editing.image_url} alt="" className="w-full h-full object-cover" /></div>}
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
              <Input value={editing?.image_url || ''} onChange={e => setEditing(prev => prev ? { ...prev, image_url: e.target.value } : null)} placeholder="Or paste URL" />
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