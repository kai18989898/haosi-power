import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Mail, Phone, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getContactMessages, deleteContactMessage } from '@/lib/api';
import type { ContactMessage } from '@/types/types';

export default function AdminMessagesPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); getContactMessages().then(setMessages).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    try { await deleteContactMessage(id); toast.success('Deleted'); load(); } catch { toast.error('Delete failed'); }
  };

  const formatDate = (str: string) => {
    try { return new Date(str).toLocaleString(); } catch { return str; }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t('admin.messages')}</h1>
        <p className="text-sm text-muted-foreground">{messages.length} messages received</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Card key={i}><CardContent className="p-4"><div className="h-4 w-1/2 bg-muted rounded animate-pulse" /></CardContent></Card>)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <Card key={msg.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {msg.name}
                      </div>
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-3 w-3 shrink-0" />
                        {msg.email}
                      </a>
                      {msg.phone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          {msg.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {formatDate(msg.created_at)}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30 shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
                      <AlertDialogHeader><AlertDialogTitle>Delete message?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(msg.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="bg-muted/60 rounded-md p-3 text-sm text-foreground">
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}