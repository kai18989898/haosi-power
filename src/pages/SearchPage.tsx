import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import PageMeta from '@/components/common/PageMeta';
import { searchProducts } from '@/lib/api';
import type { Product } from '@/types/types';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setInputValue(query);
    searchProducts(query)
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  return (
    <>
      <PageMeta title={`Search - ${query || 'Haosi Power'}`} description="Search our products and content." />

      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-balance">{t('nav.search')}</h1>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="pl-9"
                />
              </div>
              <Button type="submit">{t('nav.search')}</Button>
            </form>
          </div>

          {query && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {t('search.results_for')} <span className="font-medium text-foreground">"{query}"</span>
              </p>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i}>
                      <CardContent className="p-4 flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-full bg-muted rounded animate-pulse" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">{t('search.no_results')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map(product => (
                    <Link key={product.id} to="/products">
                      <Card className="group hover:shadow-hover transition-shadow">
                        <CardContent className="p-4 flex gap-4">
                          <div className="w-20 h-20 rounded overflow-hidden bg-muted shrink-0">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <Badge variant="secondary" className="text-xs">{t(`categories.${product.category}`)}</Badge>
                            <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 self-center" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}