import { useMemo, useState, useEffect } from 'react';
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
    setActiveCategoryId(id);
    // Al cambiar a vista filtrada, ya no necesitamos hacer scroll
  };

  const currentCategory = activeCategories.find(c => c.id === activeCategoryId);
  
  const filteredProducts = useMemo(() => {
    if (!products || !activeCategoryId) return [];
    return products
      .filter(p => p.categoryId === activeCategoryId && p.status === 'active');
  }, [products, activeCategoryId]);


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

      <div className="space-y-6 p-4 pt-4">
        {currentCategory && (
          <section key={currentCategory.id} id={currentCategory.id}>
            <h2 className="mb-4 text-2xl font-bold text-yellow-fatboy">{currentCategory.name}</h2>
            
            {filteredProducts.length === 0 ? (
              <p className="text-muted-foreground text-center">No hay productos activos en esta categoría.</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredProducts.map(product => (
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
            )}
          </section>
        )}
      </div>
    </div>
  );
}