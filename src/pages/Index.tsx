import { useMemo, useState, useRef, useEffect } from 'react';
import { useCartStore } from '@/hooks/useCartStore';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { QuantityControl } from '@/components/QuantityControl';
import { CategoryNavigation } from '@/components/CategoryNavigation';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function MenuPage() {
  const { items, addItem, removeItem } = useCartStore();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const isLoading = isLoadingCategories || isLoadingProducts;

  const activeCategories = useMemo(() => {
    if (!categories || !products) return [];
    
    const activeProductCategoryIds = new Set(
      products.filter(p => p.status === 'active').map(p => p.categoryId)
    );
    return categories
      .filter(c => c.status === 'active' && activeProductCategoryIds.has(c.id))
      .sort((a, b) => a.order - b.order);
  }, [categories, products]);

  // Set initial active category
  useEffect(() => {
    if (activeCategories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(activeCategories[0].id);
    }
  }, [activeCategories, activeCategoryId]);

  const getQuantity = (productId: string) => {
    return items.find(item => item.id === productId)?.quantity || 0;
  };

  const handleSelectCategory = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      // Scroll to the element, adjusting for the fixed header/navigation height (approx 100px)
      const headerOffset = 100; 
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
      setActiveCategoryId(id);
    }
  };

  // Observer to update active category based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategoryId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is roughly in the middle of the viewport
        threshold: 0,
      }
    );

    activeCategories.forEach((category) => {
      const element = sectionRefs.current[category.id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [activeCategories]);


  if (isLoading) {
    return <div className="mx-auto max-w-md p-4 text-center pt-20"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p className="mt-2">Cargando menú...</p></div>;
  }

  return (
    <div className="mx-auto max-w-md">
      <header className="mb-4 pt-4 text-center">
        <img 
          src="/logo.png" 
          alt="Menu Fatboy Logo" 
          className="mx-auto w-48 h-auto" 
        />
      </header>

      {/* Category Navigation */}
      <CategoryNavigation 
        categories={activeCategories} 
        activeCategoryId={activeCategoryId} 
        onSelectCategory={handleSelectCategory} 
      />

      <div className="space-y-6 p-4 pt-0">
        {activeCategories.map(category => (
          <section 
            key={category.id} 
            id={category.id}
            ref={el => sectionRefs.current[category.id] = el}
            className="pt-4" // Add padding top for better visual separation after scrolling
          >
            <h2 className="mb-2 text-xl font-semibold text-yellow-fatboy">{category.name}</h2>
            <div className="divide-y divide-gray-800">
              {products
                .filter(p => p.categoryId === category.id && p.status === 'active')
                .map(product => (
                  <div key={product.id} className="flex items-center justify-between py-3">
                    <div className="flex-1 pr-4">
                      <h3 className="font-medium text-yellow-fatboy">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-white/80">{product.description}</p>
                      )}
                      <p className="text-sm font-semibold text-red-fatboy">${product.price.toFixed(2)}</p>
                    </div>
                    <QuantityControl
                      quantity={getQuantity(product.id)}
                      onAdd={() => addItem(product as Product)}
                      onRemove={() => removeItem(product.id)}
                    />
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}