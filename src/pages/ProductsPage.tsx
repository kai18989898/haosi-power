import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageMeta from '@/components/common/PageMeta';
import { getProducts } from '@/lib/api';
import type { Product, ProductCategory } from '@/types/types';

const CATEGORIES: (ProductCategory | 'all')[] = ['all', 'power_supply', 'inverter', 'solar_panel'];

export default function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const activeCategory = (searchParams.get('category') as ProductCategory | 'all') || 'all';

  useEffect(() => {
    setLoading(true);
    const cat = activeCategory === 'all' ? undefined : (activeCategory as ProductCategory);
    getProducts(cat)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleTabChange = (value: string) => {
    if (value === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  return (
    <>
      <PageMeta title="Products - Haosi Power Energy Storage Solutions" description="Explore our range of LiFePO4 energy storage batteries, hybrid solar inverters, and high-efficiency solar panels." />

      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-balance">{t('nav.products')}</h1>
          <p className="text-muted-foreground text-pretty">{t('home.products_subtitle')}</p>
        </div>

        <Tabs value={activeCategory} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="w-full md:w-auto flex flex-wrap h-auto gap-1">
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-sm">
                {cat === 'all' ? t('product.all') : t(`categories.${cat}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">{t('product.no_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="group overflow-hidden h-full flex flex-col hover:shadow-hover transition-shadow duration-300">
                <div className="aspect-[4/3] overflow-hidden bg-muted shrink-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-5 space-y-3 flex flex-col flex-1">
                  <Badge variant="secondary" className="w-fit">{t(`categories.${product.category}`)}</Badge>
                  <h3 className="font-semibold text-base line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>
                  {product.specs && (
                    <div className="text-xs text-muted-foreground bg-muted rounded-md p-2 line-clamp-2">
                      {product.specs}
                    </div>
                  )}
                  <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
                    <Link to="/contact">
                      {t('product.inquire')}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}