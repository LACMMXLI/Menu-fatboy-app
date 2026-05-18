import { useMemo, useRef, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/hooks/useCartStore';
import { showSuccess } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Minus, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function PromotionsPage() {
  const { data: products, isLoading, isError } = useProducts();
  const { items, addItem, removeItem } = useCartStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      setScrollIndex(index);
    }
  };

  const scrollPrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
  };

  const promotions = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.isPromotion && p.status === 'active');
  }, [products]);

  const getQuantity = (productId: string) => {
    return items.find(item => item.id === productId)?.quantity || 0;
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md w-full h-full flex flex-col items-center justify-center bg-black border-x border-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-fatboy mb-2" />
        <p className="text-sm text-gray-400 font-medium">Cargando increíbles promociones...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black border-x border-gray-900">
        <div className="bg-red-fatboy/10 p-3 rounded-full border border-red-fatboy/20 mb-3">
          <span className="text-red-fatboy text-lg font-bold">!</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Error al cargar las promociones</h3>
        <p className="text-sm text-gray-400 mb-4">Por favor, verifica tu conexión e inténtalo de nuevo.</p>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="mx-auto max-w-md w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black border-x border-gray-900">
        <div className="bg-yellow-fatboy/10 p-4 rounded-full border border-yellow-fatboy/20 mb-4 animate-pulse">
          <Sparkles className="h-8 w-8 text-yellow-fatboy" />
        </div>
        <h2 className="text-xl font-bold text-yellow-fatboy mb-2">¡Próximamente más Promos!</h2>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          Nuestros chefs están cocinando las mejores ofertas para ti. Vuelve pronto para descubrir promociones exclusivas.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md w-full h-full relative border-x border-gray-900 bg-black flex flex-col overflow-hidden">
      {/* Scrolling Snap Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-row overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {promotions.map((promo, index) => {
          const quantity = getQuantity(promo.id);
          
          return (
            <div 
              key={promo.id} 
              className="h-full w-full flex-shrink-0 snap-start snap-always relative select-none bg-black overflow-hidden flex flex-col justify-end pb-20"
            >
              {/* Background Image / Fallback */}
              {promo.imageUrl ? (
                <>
                  {/* Full flyer image, completely visible and uncropped (object-contain) */}
                  <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
                    <img 
                      src={promo.imageUrl} 
                      alt={promo.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Compact Floating Action Pill */}
                  <div className="absolute bottom-[56px] left-0 right-0 z-10 flex justify-center px-4">
                    {quantity === 0 ? (
                      <Button 
                        onClick={() => {
                          addItem(promo);
                          showSuccess(`${promo.name} añadido!`);
                        }}
                        className="bg-yellow-fatboy hover:bg-yellow-fatboy/90 text-black font-extrabold text-xs py-5 px-5 rounded-full shadow-2xl border border-yellow-fatboy/30 flex items-center gap-2 active:scale-95 transition-all duration-150"
                      >
                        <Plus className="h-4 w-4 stroke-[3px]" />
                        <span>Añadir Promo</span>
                        <span className="bg-black/10 px-2 py-0.5 rounded-full text-[10px] font-black">
                          ${promo.price.toFixed(2)}
                        </span>
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-2xl">
                        <Button 
                          onClick={() => removeItem(promo.id)}
                          className="bg-red-fatboy hover:bg-red-fatboy/90 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center font-bold transition-all duration-150 active:scale-90"
                        >
                          <Minus className="h-4 w-4 stroke-[3px]" />
                        </Button>
                        <div className="flex flex-col items-center px-2">
                          <span className="text-white text-[10px] font-black leading-none">{quantity} en Carrito</span>
                          <span className="text-yellow-fatboy text-[8px] font-bold tracking-widest uppercase mt-0.5">${(promo.price * quantity).toFixed(2)}</span>
                        </div>
                        <Button 
                          onClick={() => {
                            addItem(promo);
                            showSuccess(`Otro ${promo.name} añadido!`);
                          }}
                          className="bg-yellow-fatboy hover:bg-yellow-fatboy/90 text-black rounded-full h-8 w-8 p-0 flex items-center justify-center font-bold transition-all duration-150 active:scale-90"
                        >
                          <Plus className="h-4 w-4 stroke-[3px]" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Overlay Header ONLY for text-only fallbacks */}
                  <div className="absolute top-4 left-0 right-0 z-20 flex justify-center px-4">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <span className="h-2 w-2 rounded-full bg-red-fatboy animate-ping" />
                      <span className="text-yellow-fatboy font-black text-xs tracking-widest uppercase">
                        ⚡ PROMOS EXCLUSIVAS ⚡
                      </span>
                    </div>
                  </div>

                  {/* Fallback screen without image */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-black to-red-fatboy/10 flex flex-col items-center justify-center p-6 pb-32">
                    <div className="w-20 h-20 rounded-full bg-yellow-fatboy/10 border border-yellow-fatboy/20 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-yellow-fatboy animate-pulse" />
                    </div>
                    <span className="text-muted-foreground/10 text-7xl font-black tracking-tighter uppercase select-none">
                      FATBOY
                    </span>
                  </div>

                  {/* Fallback text card */}
                  <div className="relative z-10 mx-4 w-[calc(100%-2rem)] bg-black/60 backdrop-blur-lg rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="bg-yellow-fatboy text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          PROMO DEL DÍA
                        </span>
                        <h2 className="text-2xl font-black text-white mt-2 tracking-tight line-clamp-2 leading-tight">
                          {promo.name}
                        </h2>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs text-gray-500 font-bold line-through">
                          ${(promo.price * 1.3).toFixed(2)}
                        </span>
                        <span className="text-2xl font-black text-red-fatboy leading-none mt-1">
                          ${promo.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {promo.description && (
                      <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                        {promo.description}
                      </p>
                    )}

                    <div className="mt-2">
                      {quantity === 0 ? (
                        <Button 
                          onClick={() => {
                            addItem(promo);
                            showSuccess(`${promo.name} añadido!`);
                          }}
                          className="w-full bg-yellow-fatboy hover:bg-yellow-fatboy/90 text-black font-extrabold text-base py-6 rounded-xl shadow-lg shadow-yellow-fatboy/20 active:scale-[0.98] transition-all duration-200"
                        >
                          <Plus className="h-5 w-5 mr-2 stroke-[3px]" />
                          Añadir a mi Orden
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between bg-white/5 rounded-xl p-1.5 border border-white/10">
                          <Button 
                            onClick={() => removeItem(promo.id)}
                            className="bg-red-fatboy hover:bg-red-fatboy/90 text-white rounded-lg h-11 w-11 p-0 flex items-center justify-center font-bold transition-all duration-150 active:scale-90"
                          >
                            <Minus className="h-5 w-5 stroke-[2.5px]" />
                          </Button>
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-white text-base font-extrabold">{quantity} agregados</span>
                            <span className="text-yellow-fatboy text-[10px] font-bold tracking-widest uppercase">En tu carrito</span>
                          </div>
                          <Button 
                            onClick={() => {
                              addItem(promo);
                              showSuccess(`Otro ${promo.name} añadido!`);
                            }}
                            className="bg-yellow-fatboy hover:bg-yellow-fatboy/90 text-black rounded-lg h-11 w-11 p-0 flex items-center justify-center font-bold transition-all duration-150 active:scale-90"
                          >
                            <Plus className="h-5 w-5 stroke-[2.5px]" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Swipe Right Indicator */}
              {index < promotions.length - 1 && (
                <div className="absolute bottom-[56px] right-4 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg text-yellow-fatboy/70 animate-pulse">
                  <span className="text-[9px] uppercase font-black tracking-widest opacity-80">
                    Siguiente
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Left Navigation Button */}
      {scrollIndex > 0 && (
        <button 
          onClick={scrollPrev}
          className="absolute left-3 top-[42%] -translate-y-1/2 z-30 h-9 w-9 rounded-full bg-black/45 hover:bg-black/70 active:scale-90 border border-white/10 text-white/50 hover:text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl"
          aria-label="Promoción anterior"
        >
          <ChevronLeft className="h-5 w-5 stroke-[3px]" />
        </button>
      )}

      {/* Floating Right Navigation Button */}
      {scrollIndex < promotions.length - 1 && (
        <button 
          onClick={scrollNext}
          className="absolute right-3 top-[42%] -translate-y-1/2 z-30 h-9 w-9 rounded-full bg-black/45 hover:bg-black/70 active:scale-90 border border-white/10 text-white/50 hover:text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl"
          aria-label="Siguiente promoción"
        >
          <ChevronRight className="h-5 w-5 stroke-[3px]" />
        </button>
      )}
    </div>
  );
}