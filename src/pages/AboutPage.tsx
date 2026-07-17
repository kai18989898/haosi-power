import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Eye, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageMeta from '@/components/common/PageMeta';
import { getSiteContent } from '@/lib/api';
import type { SiteContent } from '@/types/types';

const TIMELINE = [
  { year: '2018', title: 'Founded', desc: 'Haosi Power was established with a vision to make clean energy accessible.' },
  { year: '2020', title: 'Expansion', desc: 'Expanded production capacity and launched our first LiFePO4 battery line.' },
  { year: '2022', title: 'Global Reach', desc: 'Started exporting to over 30 countries across multiple continents.' },
  { year: '2024', title: 'Innovation', desc: 'Launched next-generation smart BMS technology and balcony storage systems.' },
  { year: '2026', title: 'Today', desc: 'Leading manufacturer with comprehensive energy solutions for B2B partners worldwide.' },
];

const VALUES = [
  { icon: Target, title: 'Our Mission', desc: 'To accelerate the worlds transition to sustainable energy.' },
  { icon: Eye, title: 'Our Vision', desc: 'To be the most trusted energy storage partner globally.' },
  { icon: Award, title: 'Our Values', desc: 'Innovation, quality, integrity, and customer-first approach.' },
];

export default function AboutPage() {
  const { t } = useTranslation();
  const [contents, setContents] = useState<SiteContent[]>([]);

  useEffect(() => {
    getSiteContent()
      .then(setContents)
      .catch(console.error);
  }, []);

  const aboutContents = contents.filter(c => c.section_key.startsWith('about_'));

  return (
    <>
      <PageMeta title="About Us - Haosi Power" description="Learn about Haosi Power, a leading manufacturer of renewable energy solutions." />

      {/* Hero */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4 md:px-6 text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-balance">{t('about.title')}</h1>
          <p className="text-muted-foreground max-w-prose mx-auto text-pretty">
            Leading manufacturer of LiFePO4 battery energy storage systems, hybrid solar inverters, and solar panels.
          </p>
        </div>
      </section>

      {/* Company Intro */}
      {aboutContents.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {aboutContents.map(content => (
                  <div key={content.id} className="space-y-2">
                    <h2 className="text-xl font-semibold text-balance">{content.title}</h2>
                    <p className="text-muted-foreground text-pretty leading-relaxed">{content.content}</p>
                  </div>
                ))}
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img
                  src="https://cdn.staticsyy.com/pics/4f2d3b9aa4af04716d804ddc980fe26abba2eb5d9632df3dac3b278dc09f6e4e.png"
                  alt="Haosi Power"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <Card key={idx} className="h-full">
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg">{val.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty">{val.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-balance">Our Journey</h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />
            <div className="space-y-8">
              {TIMELINE.map((item, idx) => (
                <div key={idx} className={`relative flex items-start gap-6 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden md:block flex-1" />
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1.5 mt-1.5 z-10" />
                  <div className="ml-10 md:ml-0 flex-1">
                    <Card>
                      <CardContent className="p-4 space-y-1">
                        <span className="text-sm font-bold text-primary">{item.year}</span>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground text-pretty">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}