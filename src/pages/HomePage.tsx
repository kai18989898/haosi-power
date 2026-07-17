import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Zap, Globe, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageMeta from '@/components/common/PageMeta';
import { getBanners, getProducts, getSiteContent } from '@/lib/api';
import type { Banner, Product, SiteContent, ProductCategory } from '@/types/types';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  power_supply: <Zap className="h-6 w-6" />,
  inverter: <Shield className="h-6 w-6" />,
  solar_panel: <Globe className="h-6 w-6" />,
};

const ADVANTAGE_ICONS = [Shield, Zap, Globe, Headphones];

export default function HomePage() {
  const { t } = useTranslation();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    Promise.all([getBanners(), getProducts(), getSiteContent()])
      .then(([b, p, c]) => {
        setBanners(b);
        setProducts(p);
        setContents(c);
      })
      .catch(console.error);
  }, []);

  const nextBanner = useCallback(() => {
    setCurrentBanner(prev => (prev + 1) % Math.max(banners.length, 1));
  }, [banners.length]);

  const prevBanner = useCallback(() => {
    setCurrentBanner(prev => (prev - 1 + Math.max(banners.length, 1)) % Math.max(banners.length, 1));
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(nextBanner, 5000);
    return () => clearInterval(timer);
  }, [banners.length, nextBanner]);

  const categories: ProductCategory[] = ['power_supply', 'inverter', 'solar_panel'];
  const advantages = contents.filter(c => c.section_key.startsWith('advantage_'));
  const featuredProducts = products.slice(0, 6);

  return (
    <>
      <PageMeta title="Haosi Power - Leading LiFePO4 Battery Energy Storage System Manufacturer" description="Leading manufacturer of LiFePO4 battery energy storage systems, hybrid solar inverters, and solar panels. OEM/ODM solutions for global B2B partners." />

      {/* Hero Banner */}
      {banners.length > 0 && (
        <section className="relative w-full overflow-hidden bg-muted">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container px-4 md:px-6">
                    <div className="max-w-lg space-y-4">
                      <h2 className="text-3xl md:text-5xl font-bold text-white text-balance">{banner.title}</h2>
                      <p className="text-base md:text-lg text-white/80 text-pretty">{banner.subtitle}</p>
                      <Button asChild size="lg">
                        <Link to="/products">
                          {t('home.hero_cta')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentBanner(idx)}
                    className={`h-2 rounded-full transition-all ${idx === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Product Categories */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-balance">{t('home.products_title')}</h2>
            <p className="text-muted-foreground text-pretty">{t('home.products_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => {
              const catProducts = products.filter(p => p.category === cat);
              const firstImage = catProducts[0]?.image_url;
              return (
                <Link key={cat} to={`/products?category=${cat}`}>
                  <Card className="group overflow-hidden h-full hover:shadow-hover transition-shadow duration-300">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {firstImage && (
                        <img
                          src={firstImage}
                          alt={t(`categories.${cat}`)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                          {CATEGORY_ICONS[cat]}
                        </div>
                        <h3 className="font-semibold text-lg">{t(`categories.${cat}`)}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {catProducts.length} {catProducts.length === 1 ? 'product' : 'products'}
                      </p>
                      <div className="flex items-center text-sm text-primary font-medium">
                        {t('home.view_all')}
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-balance">Featured Products</h2>
              <p className="text-muted-foreground text-pretty">Our most popular energy solutions</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <Card key={product.id} className="group overflow-hidden h-full hover:shadow-hover transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5 space-y-3 flex flex-col h-[calc(100%-16rem)]">
                    <Badge variant="secondary" className="w-fit">{t(`categories.${product.category}`)}</Badge>
                    <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
                    <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
                      <Link to="/contact">{t('home.inquire')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Advantages */}
      {advantages.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-balance">{t('home.advantages_title')}</h2>
              <p className="text-muted-foreground text-pretty">{t('home.advantages_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((adv, idx) => {
                const Icon = ADVANTAGE_ICONS[idx % ADVANTAGE_ICONS.length];
                return (
                  <Card key={adv.id} className="h-full">
                    <CardContent className="p-6 space-y-4 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold">{adv.title}</h3>
                      <p className="text-sm text-muted-foreground text-pretty">{adv.content}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-balance">Ready to Power Your Future?</h2>
          <p className="text-primary-foreground/80 max-w-prose mx-auto text-pretty">
            Contact us today to discuss your energy storage needs. Our team is ready to provide customized solutions for your business.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">
              {t('home.inquire')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}