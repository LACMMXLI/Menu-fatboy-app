import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/hooks/useCartStore';

interface PromotionCarouselProps {
  promotions: Product[];
}

export function PromotionCarousel({ promotions }: PromotionCarouselProps) {
  const { addItem } = useCartStore();

  if (promotions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No hay promociones activas por el momento.
      </div>
    );
  }

  return (
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {promotions.map((promo, index) => (
          <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="bg-card border-yellow-fatboy/50 overflow-hidden">
                {promo.imageUrl && (
                  <div className="h-48 w-full overflow-hidden"> {/* Contenedor de altura fija */}
                    <img 
                      src={promo.imageUrl} 
                      alt={promo.name} 
                      className="w-full h-full object-cover" // La imagen cubre el contenedor
                    />
                  </div>
                )}
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-xl font-bold text-yellow-fatboy mb-2">{promo.name}</h3>
                  <p className="text-sm text-white/80 mb-4 line-clamp-3">{promo.description || '¡Aprovecha esta oferta especial!'}</p>
                  <p className="text-2xl font-extrabold text-red-fatboy mb-4">${promo.price.toFixed(2)}</p>
                  <Button 
                    onClick={() => addItem(promo)} 
                    className="w-full bg-red-fatboy hover:bg-red-fatboy/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4 space-x-4">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}