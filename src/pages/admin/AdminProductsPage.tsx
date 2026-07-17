import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getAllProducts, upsertProduct, deleteProduct, uploadImage } from '@/lib/api';
import type { Product, ProductCategory } from '@/types/types';

const CATEGORIES: ProductCategory[] = ['power_supply', 'inverter', 'solar_panel'];

export default function AdminProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState<string>('all');

  const load = () => { setLoading(true); getAllProducts().then(setProducts).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const filtered = filterCat === 'all' ? products : products.filter(p => p.category === filterCat);

  const openAdd = () => { setEditing({ category: 'power_supply', name: '', description: '', specs: '', image_url: '', sort_order: products.length + 1, is_active: true }); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing({ ...p }); setDialogOpen(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setEditing(prev => prev ? { ...prev, image_url: url } : null); }
    catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!editing?.name || !editing?.category) { toast.error('Name and category are required'); return; }
    setSaving(true);
    try {
      await upsertProduct(editing as Product);
      toast.success('Saved successfully');
      setDialogOpen(false);
      load();
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteProduct(id); toast.success('Deleted'); load(); } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (product: Product) => {
    try { await upsertProduct({ ...product, is_active: !product.is_active }); load(); } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">{t('admin.products')}</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('product.all')}</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{t(`categories.${c}`)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" />{t('admin.add')}</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Card key={i}><div className="aspect-[4/3] bg-muted animate-pulse rounded-t-lg" /><CardContent className="p-4"><div className="h-4 w-3/4 bg-muted rounded animate-pulse" /></CardContent></Card>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => (
            <Card key={product.id} className={`overflow-hidden ${!product.is_active ? 'opacity-60' : ''}`}>
              <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />}
                <div className="absolute top-2 left-2"><Badge variant="secondary" className="text-xs">{t(`categories.${product.category}`)}</Badge></div>
                <div className="absolute top-2 right-2"><Switch checked={product.is_active} onCheckedChange={() => handleToggle(product)} /></div>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => openEdit(product)}><Pencil className="h-3 w-3 mr-1" />{t('admin.edit')}</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10"><Trash2 className="h-3 w-3 mr-1" />{t('admin.delete')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                      <AlertDialogHeader><AlertDialogTitle>Delete Product?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
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
          <DialogHeader><DialogTitle>{editing?.id ? t('admin.edit') : t('admin.add')} Product</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={editing?.category || 'power_supply'} onValueChange={v => setEditing(prev => prev ? { ...prev, category: v as ProductCategory } : null)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{t(`categories.${c}`)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={editing?.name || ''} onChange={e => setEditing(prev => prev ? { ...prev, name: e.target.value } : null)} />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={editing?.description || ''} onChange={e => setEditing(prev => prev ? { ...prev, description: e.target.value } : null)} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Specifications</Label>
              <Textarea value={editing?.specs || ''} onChange={e => setEditing(prev => prev ? { ...prev, specs: e.target.value } : null)} rows={3} placeholder="e.g. Voltage: 51.2V, Capacity: 100Ah" />
            </div>
            <div className="space-y-1.5">
              <Label>Product Image</Label>
              {editing?.image_url && <div className="aspect-[4/3] rounded overflow-hidden bg-muted"><img src={editing.image_url} alt="" className="w-full h-full object-cover" /></div>}
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
              <Input value={editing?.image_url || ''} onChange={e => setEditing(prev => prev ? { ...prev, image_url: e.target.value } : null)} placeholder="Or paste URL: https://..." />
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