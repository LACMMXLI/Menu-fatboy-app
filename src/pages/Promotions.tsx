import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { PromotionCarousel } from '@/components/PromotionCarousel';
import { Loader2 } from 'lucide-react';

export default function PromotionsPage() {
  const { data: products, isLoading, isError } = useProducts();

  const promotions = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.isPromotion && p.status === 'active');
  }, [products]);

  if (isLoading) {
    return <div className="mx-auto max-w-md p-4 text-center pt-20"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p className="mt-2">Cargando promociones...</p></div>;
  }

  if (isError) {
    return <div className="text-center p-8 text-destructive">Error al cargar las promociones.</div>;
  }

  return (
    <div className="mx-auto max-w-md p-4 pt-8">
      <h1 className="mb-8 text-3xl font-bold text-center text-yellow-fatboy">Promociones del Día</h1>
      <PromotionCarousel promotions={promotions} />
      
      {promotions.length > 0 && (
        <div className="mt-10 p-4 bg-card/50 rounded-lg border border-gray-800 text-center">
          <p className="text-sm text-muted-foreground">
            Las promociones añadidas al carrito se procesarán junto con tu pedido principal.
          </p>
        </div>
      )}
    </div>
  );
}