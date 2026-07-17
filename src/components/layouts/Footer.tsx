import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Youtube, MessageCircle, Mail, MapPin } from 'lucide-react';
import { getSocialLinks, getContactInfo, getSiteSettings } from '@/lib/api';
import type { SocialLink, ContactInfo, SiteSetting } from '@/types/types';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  tiktok: <MessageCircle className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
};

export default function Footer() {
  const { t } = useTranslation();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [settings, setSettings] = useState<SiteSetting[]>([]);

  useEffect(() => {
    Promise.all([getSocialLinks(), getContactInfo(), getSiteSettings()])
      .then(([s, c, st]) => {
        setSocials(s);
        setContact(c);
        setSettings(st);
      })
      .catch(console.error);
  }, []);

  const footerText = settings.find(s => s.key === 'footer_text')?.value || '© 2026 Haosi Power. All rights reserved.';

  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
                H
              </div>
              <span className="font-bold text-lg">Haosi Power</span>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              Leading manufacturer of LiFePO4 battery energy storage systems, hybrid solar inverters, and solar panels.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('footer.quick_links')}</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.home')}</Link>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.products')}</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.about')}</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('nav.contact')}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('footer.contact')}</h3>
            <div className="space-y-2">
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="break-all">{contact.email}</span>
                </a>
              )}
              {contact?.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{contact.address}</span>
                </div>
              )}
              {contact?.whatsapp_numbers && contact.whatsapp_numbers.length > 0 && (
                <div className="space-y-1">
                  {contact.whatsapp_numbers.map(num => (
                    <a
                      key={num}
                      href={`https://wa.me/${num.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      <span>+{num.replace(/[^0-9]/g, '').replace(/^86/, '86 ')}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Social */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-muted-foreground">{t('footer.follow_us')}:</span>
                {socials.map(s => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {SOCIAL_ICONS[s.icon] || <MessageCircle className="h-4 w-4" />}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          {footerText}
        </div>
      </div>
    </footer>
  );
}