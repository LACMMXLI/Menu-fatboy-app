import { useMemo } from 'react';
import { useCartStore } from '@/hooks/useCartStore';
import { useCategoryStore } from '@/hooks/useCategoryStore';
import { useProductStore } from '@/hooks/useProductStore';
import { QuantityControl } from '@/components/QuantityControl';
import type { Product } from '@/lib/types';

export default function MenuPage() {
  const { items, addItem, removeItem } = useCartStore();
  const { categories } = useCategoryStore();
  const { products } = useProductStore();

  const activeCategories = useMemo(() => {
    const activeProductCategoryIds = new Set(
      products.filter(p => p.status === 'active').map(p => p.categoryId)
    );
    return categories
      .filter(c => c.status === 'active' && activeProductCategoryIds.has(c.id))
      .sort((a, b) => a.order - b.order);
  }, [categories, products]);

  const getQuantity = (productId: string) => {
    return items.find(item => item.id === productId)?.quantity || 0;
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Menú Digital</h1>
      </header>

      <div className="space-y-6">
        {activeCategories.map(category => (
          <section key={category.id}>
            <h2 className="mb-2 text-xl font-semibold">{category.name}</h2>
            <div className="divide-y dark:divide-gray-700">
              {products
                .filter(p => p.categoryId === category.id && p.status === 'active')
                .map(product => (
                  <div key={product.id} className="flex items-center justify-between py-3">
                    <div className="flex-1 pr-4">
                      <h3 className="font-medium">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      )}
                      <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
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