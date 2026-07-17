import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageCircle, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import PageMeta from '@/components/common/PageMeta';
import { getContactInfo, submitContactMessage } from '@/lib/api';
import type { ContactInfo } from '@/types/types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  useEffect(() => {
    getContactInfo().then(setContact).catch(console.error);
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await submitContactMessage({
        name: values.name,
        email: values.email,
        phone: values.phone || '',
        message: values.message,
      });
      toast.success(t('contact.success'));
      form.reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPhone = (num: string) => {
    const digits = num.replace(/[^0-9]/g, '');
    return `+${digits.replace(/^86/, '86 ')}`;
  };

  return (
    <>
      <PageMeta title="Contact Us - Haosi Power" description="Get in touch with Haosi Power for inquiries about our energy storage systems, solar inverters, and solar panels." />

      {/* Hero */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4 md:px-6 text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-balance">{t('contact.title')}</h1>
          <p className="text-muted-foreground max-w-prose mx-auto text-pretty">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                {contact?.whatsapp_numbers && contact.whatsapp_numbers.length > 0 && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold">{t('contact.whatsapp')}</h3>
                      </div>
                      <div className="space-y-2">
                        {contact.whatsapp_numbers.map(num => (
                          <a
                            key={num}
                            href={`https://wa.me/${num.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                            {formatPhone(num)}
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {contact?.email && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Mail className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold">Email</h3>
                      </div>
                      <a href={`mailto:${contact.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                        {contact.email}
                      </a>
                    </CardContent>
                  </Card>
                )}

                {contact?.address && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold">Address</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.address}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.name')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('contact.name')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.email')} *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('contact.email')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.phone')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('contact.phone')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.message')} *</FormLabel>
                          <FormControl>
                            <Textarea placeholder={t('contact.message')} rows={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Sending...' : t('contact.submit')}
                      {!submitting && <Send className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}